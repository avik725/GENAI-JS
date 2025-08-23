import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { UserRound } from "lucide-react";

export default function UserHoverCard({ name, username }) {
  return (
    <>
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="default" className="cursor-pointer bg-primary/80">
            <UserRound />
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-80" align="end">
          <div className="flex justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-lg font-semibold text-primary">Welcome, {name} !</h4>
              <p className="text-sm">
                Username :
                <span className="ms-2 font-semibold">{username}</span>
              </p>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </>
  );
}
