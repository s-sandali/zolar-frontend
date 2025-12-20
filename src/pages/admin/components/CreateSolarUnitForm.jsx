import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCreateSolarUnitMutation } from "@/lib/redux/query"
import { useState } from "react"
import { MapPin, AlertTriangle } from "lucide-react"

const formSchema = z.object({
    serialNumber: z.string().min(1, { message: "Serial number is required" }),
    installationDate: z.string().min(1, { message: "Installation date is required" }),
    capacity: z.number().positive({ message: "Capacity must be a positive number" }),
    status: z.enum(["ACTIVE", "INACTIVE", "MAINTENANCE"], { message: "Please select a valid status" }),
    location: z.object({
        latitude: z.number().min(-90).max(90),
        longitude: z.number().min(-180).max(180),
        city: z.string().optional(),
        country: z.string().optional(),
    }).optional(),
});

export function CreateSolarUnitForm() {
    const [isDetectingLocation, setIsDetectingLocation] = useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
    })

    const [createSolarUnit, { isLoading: isCreatingSolarUnit }] = useCreateSolarUnitMutation();

    // Auto-detect location using browser geolocation API
    const handleDetectLocation = () => {
        setIsDetectingLocation(true);

        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            setIsDetectingLocation(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                // Set coordinates
                form.setValue("location.latitude", latitude);
                form.setValue("location.longitude", longitude);

                // Reverse geocode to get city name (using Nominatim - free API)
                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                    );
                    const data = await response.json();

                    const city = data.address?.city || data.address?.town || data.address?.village || "";
                    const country = data.address?.country || "";

                    form.setValue("location.city", city);
                    form.setValue("location.country", country);
                } catch (error) {
                    console.error("Error fetching city name:", error);
                }

                setIsDetectingLocation(false);
            },
            (error) => {
                console.error("Error detecting location:", error);
                alert("Unable to detect location. Please enter manually.");
                setIsDetectingLocation(false);
            }
        );
    };

    async function onSubmit(values) {
        try {
            await createSolarUnit(values).unwrap();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="serialNumber"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Serial Number</FormLabel>
                            <FormControl>
                                <Input placeholder="Serial Number" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="installationDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Installation Date</FormLabel>
                            <FormControl>
                                <Input placeholder="Installation Date" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="capacity"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Capacity</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="Capacity" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Status</FormLabel>
                            <FormControl>
                                <Select value={field.value || ""} onValueChange={field.onChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ACTIVE">Active</SelectItem>
                                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                                        <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Location Section */}
                <div className="space-y-4 border-t pt-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Location (for weather data)</h3>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleDetectLocation}
                            disabled={isDetectingLocation}
                        >
                            <MapPin className="w-4 h-4 mr-2" />
                            {isDetectingLocation ? "Detecting..." : "Auto-detect"}
                        </Button>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-muted-foreground bg-amber-50 border border-amber-200 rounded-md p-3">
                        <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-600" />
                        <span>Note: Auto-detect uses your location, not the user's. Users can set their own location from their dashboard for accurate weather data.</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="location.latitude"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Latitude</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="any"
                                            placeholder="37.7749"
                                            {...field}
                                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="location.longitude"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Longitude</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="any"
                                            placeholder="-122.4194"
                                            {...field}
                                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="location.city"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>City (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="San Francisco" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="location.country"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Country (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="United States" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <Button type="submit" disabled={isCreatingSolarUnit}>{isCreatingSolarUnit ? "Creating..." : "Create"}</Button>
            </form>
        </Form>
    );
}