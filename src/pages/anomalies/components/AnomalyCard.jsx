import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Moon, CheckCircle, Sun, Zap, TrendingDown } from "lucide-react";
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
    case 'OVERPRODUCTION':
      return <Zap className="h-5 w-5" />;
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

const AnomalyCard = ({ anomaly }) => {
  const [acknowledgeAnomaly, { isLoading: isAcknowledging }] = useAcknowledgeAnomalyMutation();
  const [resolveAnomaly, { isLoading: isResolving }] = useResolveAnomalyMutation();
  const [showResolveDialog, setShowResolveDialog] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState('');

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
        {/* Description */}
        <div>
          <p className="text-sm text-gray-700 leading-relaxed">
            {anomaly.description}
          </p>
        </div>

        {/* Metadata */}
        {anomaly.metadata && (
          <div className="grid grid-cols-3 gap-4 p-3 bg-gray-50 rounded-lg">
            {anomaly.metadata.expectedValue !== undefined && (
              <div>
                <p className="text-xs text-gray-500 font-medium">Expected</p>
                <p className="text-sm font-semibold text-gray-900">
                  {anomaly.metadata.expectedValue} Wh
                </p>
              </div>
            )}
            {anomaly.metadata.actualValue !== undefined && (
              <div>
                <p className="text-xs text-gray-500 font-medium">Actual</p>
                <p className="text-sm font-semibold text-gray-900">
                  {anomaly.metadata.actualValue} Wh
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

        {/* Threshold Information */}
        {anomaly.metadata?.threshold && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs font-medium text-blue-900 mb-1">Detection Threshold</p>
            <p className="text-sm text-blue-700">{anomaly.metadata.threshold}</p>
          </div>
        )}

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
