import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/app-components/ui/accordion";
import { ScrollArea } from "@/components/app-components/ui/scroll-area";

export function FilterComponent() {
  return (
    <ScrollArea className="md:w-64 md:h-72">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>Salary</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <p>it will contain filter by Salary</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Rating</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <p>it will contain filter by rating</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Qualification</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <p>it will contain filter by Qualification</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </ScrollArea>
  );
}
