import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MapPin, Check, AlertCircle } from "lucide-react";
import { useEditSolarUnitMutation } from "@/lib/redux/query";

const formSchema = z.object({
    location: z.object({
        latitude: z.number().min(-90).max(90),
        longitude: z.number().min(-180).max(180),
        city: z.string().optional(),
        country: z.string().optional(),
    }),
});

export function LocationEditor({ solarUnit }) {
    const [isDetectingLocation, setIsDetectingLocation] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            location: solarUnit.location || {
                latitude: null,
                longitude: null,
                city: "",
                country: "",
            },
        },
    });

    const [editSolarUnit, { isLoading: isEditingSolarUnit }] = useEditSolarUnitMutation();

    // Auto-detect location using browser geolocation API
    const handleDetectLocation = () => {
        setIsDetectingLocation(true);
        setIsSaved(false);

        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            setIsDetectingLocation(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                form.setValue("location.latitude", latitude);
                form.setValue("location.longitude", longitude);

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
            await editSolarUnit({
                id: solarUnit._id,
                data: {
                    serialNumber: solarUnit.serialNumber,
                    installationDate: solarUnit.installationDate,
                    capacity: solarUnit.capacity,
                    status: solarUnit.status,
                    userId: solarUnit.userId,
                    location: values.location,
                },
            }).unwrap();

            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 3000);
        } catch (error) {
            console.error("Error updating location:", error);
        }
    }

    const hasLocation = solarUnit.location?.latitude && solarUnit.location?.longitude;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Solar Panel Location</CardTitle>
                <CardDescription>
                    {hasLocation
                        ? "Update your solar panel's location for accurate weather data"
                        : "Set your solar panel's location to enable weather insights"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                Use auto-detect or enter coordinates manually
                            </p>
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
                                                onChange={(e) => {
                                                    field.onChange(Number.parseFloat(e.target.value));
                                                    setIsSaved(false);
                                                }}
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
                                                onChange={(e) => {
                                                    field.onChange(Number.parseFloat(e.target.value));
                                                    setIsSaved(false);
                                                }}
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
                                            <Input
                                                placeholder="San Francisco"
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    setIsSaved(false);
                                                }}
                                            />
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
                                            <Input
                                                placeholder="United States"
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    setIsSaved(false);
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <Button type="submit" disabled={isEditingSolarUnit}>
                                {isEditingSolarUnit ? "Saving..." : "Save Location"}
                            </Button>
                            {isSaved && (
                                <span className="flex items-center text-sm text-green-600">
                                    <Check className="w-4 h-4 mr-1" />
                                    Location saved!
                                </span>
                            )}
                        </div>

                        {!hasLocation && (
                            <div className="flex items-start gap-2 text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-md p-3">
                                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <span>Weather widget will be available once you set your location.</span>
                            </div>
                        )}
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
