import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  items: { value: string; label: string }[];
  category: string;
};

export default function SuperSelect({ category, items }: Props) {
  return (
    <Select>
      <SelectTrigger className="w-2/3">
        <SelectValue placeholder={`Select a ${category}`} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{category}</SelectLabel>
          {items?.map((item) => (
            <SelectItem value={item.value} key={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
