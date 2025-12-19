import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/app-components/ui/accordion";
import { ScrollArea } from "@/components/app-components/ui/scroll-area";
import { Slider } from "@/components/app-components/ui/slider"
import { Label } from "@/components/app-components/ui/label"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/app-components/ui/radio-group"
import { useState } from "react";

export function FilterComponent() {
  const [salarySliderValue, setSalarySliderValue] = useState([5000]);
  const [expSliderValue, setExpSliderValue] = useState([0]);
  return (
    <ScrollArea className="md:w-64 ">
      <Accordion type="multiple" className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>Salary</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <p>₹5K - ₹5L</p>
            <p>
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
              }).format(salarySliderValue[0])}
            </p>
            <Slider
              defaultValue={salarySliderValue}
              max={500000}
              min={5000}
              step={1000}
              onValueChange={(num) => setSalarySliderValue(num)}
            />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Experience</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <p>{expSliderValue[0] ? `${expSliderValue[0]}+ years` : `0 year`}</p>
            <Slider
              defaultValue={expSliderValue}
              max={30}
              min={0}
              step={1}
              onValueChange={(num) => setExpSliderValue(num)}
            />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Qualification</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <RadioGroup defaultValue="comfortable">
              <div className="flex items-center gap-3">
                <RadioGroupItem value="matric" id="r1" />
                <Label htmlFor="r1">Matric</Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="inter" id="r2" />
                <Label htmlFor="r2">Inter</Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="graduate" id="r3" />
                <Label htmlFor="r3">Graduate</Label>
              </div>
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </ScrollArea>
  );
}
