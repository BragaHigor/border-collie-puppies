export function getTriggerClassName(active: boolean): string {
   const base = [
      "w-full",
      "p-0",
      "bg-transparent",
      "border-none",
      "focus:ring-0",
      "text-left",
      "text-sm",
      "px-2",
   ];

   const conditional = active
      ? [
           "bg-primary",
           "text-accent",
           "border-b-2",
           "border-accent",
           "capitalize",
        ]
      : ["text-primary"];

   return [...base, ...conditional].join(" ");
}
