import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Moon, Check, CheckCircle, Sun, TrendingDown, CloudRain, AlertTriangle } from "lucide-react";
import { useAcknowledgeAnomalyMutation, useResolveAnomalyMutation } from "@/lib/redux/query";
import { useState } from "react";

// Helper function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Helper function to get severity color
const getSeverityColor = (severity) => {
  switch (severity) {
    case 'CRITICAL':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'WARNING':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'INFO':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

// Helper function to get severity badge variant
const getSeverityBadgeVariant = (severity) => {
  switch (severity) {
    case 'CRITICAL':
      return 'destructive';
    case 'WARNING':
      return 'default';
    case 'INFO':
      return 'secondary';
    default:
      return 'outline';
  }
};

// Helper function to get status badge variant
const getStatusBadgeVariant = (status) => {
  switch (status) {
    case 'OPEN':
      return 'destructive';
    case 'ACKNOWLEDGED':
      return 'default';
    case 'RESOLVED':
      return 'secondary';
    default:
      return 'outline';
  }
};

// Helper function to get anomaly type icon
const getAnomalyIcon = (type) => {
  switch (type) {
    case 'NIGHTTIME_GENERATION':
      return <Moon className="h-5 w-5" />;
    case 'ZERO_GENERATION_CLEAR_SKY':
      return <Sun className="h-5 w-5" />;
    case 'ENERGY_EXCEEDING_THRESHOLD':
      return <AlertTriangle className="h-5 w-5" />;
    case 'HIGH_GENERATION_BAD_WEATHER':
    case 'LOW_GENERATION_CLEAR_WEATHER':
      return <CloudRain className="h-5 w-5" />;
    case 'SUDDEN_PRODUCTION_DROP':
      return <TrendingDown className="h-5 w-5" />;
    default:
      return <AlertCircle className="h-5 w-5" />;
  }
};

// Helper function to format anomaly type
const formatAnomalyType = (type) => {
  return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};

const ANOMALY_INSIGHTS = {
  ENERGY_EXCEEDING_THRESHOLD: {
    meaning: "Reading jumped above the unit's physical capacity.",
    context: ["Expected limit", "Measured spike", "Impossible for hardware"],
    impact: {
      title: "Invalid data inflates reports",
      details: "KPIs and invoices will overstate energy until this sensor or configuration issue is fixed."
    },
    actions: [
      "Compare the configured capacity with the inverter nameplate.",
      "Inspect metering wiring for cross-feed or duplication.",
      "Escalate to your admin if spikes keep appearing."
    ]
  },
  ZERO_GENERATION_CLEAR_SKY: {
    meaning: "Daylight hours show flat zero production.",
    context: ["Sunlight available", "No output", "Weather OK"],
    impact: {
      title: "Potential production loss",
      details: "Power may be down even though irradiance is healthy revenue could be affected."
    },
    actions: [
      "Check inverter status or alarms.",
      "Verify grid connection and breakers.",
      "Log a maintenance ticket if it stays flat next interval."
    ]
  },
  NIGHTTIME_GENERATION: {
    meaning: "Energy logged during dark hours.",
    context: ["After sunset", "Non-zero reading", "Clock mismatch"],
    impact: {
      title: "Data quality risk",
      details: "Nighttime energy corrupts daily totals and can hide real faults."
    },
    actions: [
      "Confirm device timezone and daylight-saving settings.",
      "Check ingestion pipeline for delayed payloads.",
      "Notify support if it keeps happening."
    ]
  },
  LOW_GENERATION_CLEAR_WEATHER: {
    meaning: "Clear weather but output is well below baseline.",
    context: ["Clear sky", "Peak hours", "Low ratio"],
    impact: {
      title: "Efficiency loss",
      details: "Panels might be dirty, shaded, or degrading expect lower billable energy."
    },
    actions: [
      "Inspect panels for dust or new shading.",
      "Schedule cleaning or preventive maintenance.",
      "Track the ratio for a few days to confirm recovery."
    ]
  },
  HIGH_GENERATION_BAD_WEATHER: {
    meaning: "Stormy weather but energy looks unusually high.",
    context: ["Rain/clouds", "High output", "Weather mismatch"],
    impact: {
      title: "Source mismatch",
      details: "Weather feed or site mapping may be wrong, which skews insights and billing."
    },
    actions: [
      "Verify site coordinates and weather source.",
      "Ensure weather sync jobs are up to date.",
      "Compare recent batches for duplication."
    ]
  },
  FROZEN_GENERATION: {
    meaning: "Reading hasn't changed for multiple intervals.",
    context: ["Same value", "Changing weather", "Telemetry stuck"],
    impact: {
      title: "Stale dashboard",
      details: "Real issues stay hidden while the feed is frozen." 
    },
    actions: [
      "Check the data logger or gateway connection.",
      "Restart the collector/service if possible.",
      "Escalate if the stream does not resume." 
    ]
  }
};

const getAnomalyInsight = (type) => {
  if (ANOMALY_INSIGHTS[type]) {
    return ANOMALY_INSIGHTS[type];
  }

  return {
    meaning: `${formatAnomalyType(type)} detected review the latest readings.`,
    context: ["Outlier detected", "Check live data"],
    impact: {
      title: "Needs operator review",
      details: "The pattern deviates from historical behavior and may hide a fault."
    },
    actions: [
      "Validate the source data in your monitoring console.",
      "Acknowledge or resolve once you confirm the status."
    ]
  };
};

const AnomalyCard = ({ anomaly }) => {
  const [acknowledgeAnomaly, { isLoading: isAcknowledging }] = useAcknowledgeAnomalyMutation();
  const [resolveAnomaly, { isLoading: isResolving }] = useResolveAnomalyMutation();
  const [showResolveDialog, setShowResolveDialog] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const insight = getAnomalyInsight(anomaly.type);

  const handleAcknowledge = async () => {
    try {
      await acknowledgeAnomaly(anomaly._id).unwrap();
    } catch (error) {
      console.error('Failed to acknowledge anomaly:', error);
    }
  };

  const handleResolve = async () => {
    try {
      await resolveAnomaly({ id: anomaly._id, resolutionNotes }).unwrap();
      setShowResolveDialog(false);
      setResolutionNotes('');
    } catch (error) {
      console.error('Failed to resolve anomaly:', error);
    }
  };

  return (
    <Card className={`relative border-l-4 ${
      anomaly.severity === 'CRITICAL' ? 'border-l-red-500' :
      anomaly.severity === 'WARNING' ? 'border-l-orange-500' :
      'border-l-blue-500'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              anomaly.severity === 'CRITICAL' ? 'bg-red-100 text-red-600' :
              anomaly.severity === 'WARNING' ? 'bg-orange-100 text-orange-600' :
              'bg-blue-100 text-blue-600'
            }`}>
              {getAnomalyIcon(anomaly.type)}
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">
                {formatAnomalyType(anomaly.type)}
              </CardTitle>
              <CardDescription className="text-sm text-gray-500 mt-1">
                Detected on {formatDate(anomaly.detectedAt)}
              </CardDescription>
            </div>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <Badge variant={getSeverityBadgeVariant(anomaly.severity)}>
              {anomaly.severity}
            </Badge>
            <Badge variant={getStatusBadgeVariant(anomaly.status)}>
              {anomaly.status}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="rounded-xl border border-slate-200/70 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/40">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Insight</p>
          <p className="mt-1 text-base font-medium text-slate-900 dark:text-white">{insight.meaning}</p>
        </div>

        <div className="rounded-lg border-l-4 border-l-slate-600 bg-slate-50/80 p-4 dark:border-l-slate-400 dark:bg-slate-900/40">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">Impact</p>
            <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{insight.impact.title}</p>
            <p className="mt-1 text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{insight.impact.details}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-slate-200/70 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-950/30">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Recommended next steps</p>
            <ul className="mt-3 space-y-2">
              {insight.actions.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-200">
                  <Check className="mt-0.5 h-4 w-4 text-emerald-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {anomaly.description && (
          <div className="rounded-lg border border-slate-200/60 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-900/40">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">System note</p>
            <p className="mt-1 text-sm text-slate-800 dark:text-slate-100 leading-relaxed">{anomaly.description}</p>
          </div>
        )}

        {/* Metadata */}
        {anomaly.metadata && (
          <div className="grid grid-cols-3 gap-4 p-3 bg-gray-50 rounded-lg">
            {anomaly.metadata.expectedValue !== undefined && (
              <div>
                <p className="text-xs text-gray-500 font-medium">Expected</p>
                <p className="text-sm font-semibold text-gray-900">
                  {(anomaly.metadata.expectedValue / 1000).toFixed(2)} kWh
                </p>
              </div>
            )}
            {anomaly.metadata.actualValue !== undefined && (
              <div>
                <p className="text-xs text-gray-500 font-medium">Actual</p>
                <p className="text-sm font-semibold text-gray-900">
                  {(anomaly.metadata.actualValue / 1000).toFixed(2)} kWh
                </p>
              </div>
            )}
            {anomaly.metadata.deviation !== undefined && (
              <div>
                <p className="text-xs text-gray-500 font-medium">Deviation</p>
                <p className="text-sm font-semibold text-red-600">
                  {anomaly.metadata.deviation}%
                </p>
              </div>
            )}
          </div>
        )}

        {/* Threshold removed per UX request */}

        {/* Resolution Notes (if resolved) */}
        {anomaly.status === 'RESOLVED' && anomaly.resolutionNotes && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <p className="text-xs font-medium text-green-900">Resolution Notes</p>
            </div>
            <p className="text-sm text-green-700">{anomaly.resolutionNotes}</p>
            <p className="text-xs text-green-600 mt-1">
              Resolved on {formatDate(anomaly.resolvedAt)}
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2 pt-3 border-t">
        {anomaly.status === 'OPEN' && (
          <Button
            onClick={handleAcknowledge}
            disabled={isAcknowledging}
            variant="outline"
            size="sm"
          >
            {isAcknowledging ? 'Acknowledging...' : 'Acknowledge'}
          </Button>
        )}

        {anomaly.status === 'ACKNOWLEDGED' && !showResolveDialog && (
          <Button
            onClick={() => setShowResolveDialog(true)}
            variant="default"
            size="sm"
          >
            Mark as Resolved
          </Button>
        )}

        {showResolveDialog && (
          <div className="flex-1 space-y-2">
            <textarea
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              placeholder="Add resolution notes (optional)..."
              className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
            />
            <div className="flex gap-2">
              <Button
                onClick={handleResolve}
                disabled={isResolving}
                variant="default"
                size="sm"
              >
                {isResolving ? 'Resolving...' : 'Confirm Resolution'}
              </Button>
              <Button
                onClick={() => {
                  setShowResolveDialog(false);
                  setResolutionNotes('');
                }}
                variant="outline"
                size="sm"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {anomaly.status === 'RESOLVED' && (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Resolved</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default AnomalyCard;
