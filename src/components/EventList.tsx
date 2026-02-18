import { MapEvent } from "@/types";
import EventCard from "./EventCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";

interface EventListProps {
  events: MapEvent[];
  onJoin: (id: string) => void;
}

const EventList = ({ events, onJoin }: EventListProps) => {
  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-3">
        <h2 className="font-display font-bold text-lg text-foreground">
          Nearby Events
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {events.length} events around you
        </p>
        {events.map((event, i) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <EventCard event={event} onJoin={onJoin} />
          </motion.div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default EventList;
