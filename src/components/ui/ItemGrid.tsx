
import { ItemCard } from "@/components/ui/ItemCard";
import { Item, User } from "@/types";

interface ItemGridProps {
  items: Item[];
  users: User[];
}

export const ItemGrid = ({ items, users }: ItemGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item) => {
        const owner = users.find((user) => user.id === item.userId)!;
        return <ItemCard key={item.id} item={item} owner={owner} />;
      })}
    </div>
  );
};
