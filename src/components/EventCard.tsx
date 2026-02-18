import { MapEvent } from "@/types";
import { motion } from "framer-motion";
import { MapPin, Clock, DollarSign, Users, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface EventCardProps {
  event: MapEvent;
  onJoin?: (id: string) => void;
  compact?: boolean;
}

const categoryColors: Record<string, string> = {
  food: "bg-primary text-primary-foreground",
  activity: "bg-accent text-accent-foreground",
  nightlife: "bg-secondary text-secondary-foreground",
  outdoors: "bg-event-pending text-foreground",
};

const EventCard = ({ event, onJoin, compact }: EventCardProps) => {
  const spotsLeft = event.maxAttendees - event.attendees.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-lg border bg-card p-4 transition-all hover:shadow-elevated ${
        event.accepted ? "event-accepted animate-pulse-glow border-accent" : "border-border"
      } ${compact ? "p-3" : ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge className={`${categoryColors[event.category]} text-xs font-medium`}>
              {event.category}
            </Badge>
            {event.accepted && (
              <Badge className="bg-accent text-accent-foreground text-xs">
                <Check className="w-3 h-3 mr-1" /> Accepted
              </Badge>
            )}
          </div>
          <h3 className="font-display font-semibold text-card-foreground truncate">
            {event.title}
          </h3>
          {!compact && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {event.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mt-3 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-primary" />
          <span className="truncate max-w-[140px]">{event.location.address}</span>
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-primary" />
          {event.time}
        </span>
        <span className="flex items-center gap-1">
          <DollarSign className="w-3.5 h-3.5 text-primary" />
          {event.price}
        </span>
        <span className="flex items-center gap-1">
          <Users className="w-3.5 h-3.5 text-primary" />
          {spotsLeft} spots left
        </span>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center text-[10px] text-primary-foreground font-bold">
            {event.createdBy.name[0]}
          </div>
          <span className="text-xs text-muted-foreground">{event.createdBy.name}</span>
        </div>
        {!event.accepted && onJoin && (
          <Button
            size="sm"
            onClick={() => onJoin(event.id)}
            className="gradient-primary text-primary-foreground text-xs h-7 px-3"
          >
            Join
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default EventCard;
