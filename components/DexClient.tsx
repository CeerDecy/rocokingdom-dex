import DexClientClient from "@/components/DexClientClient";
import type { AttributeData, PetData } from "@/lib/dexTypes";

type PetEntry = PetData & { key: string };

type DexClientProps = {
  pets: PetEntry[];
  attributes: Record<string, AttributeData>;
  activeKey: string;
  activeFilter: string | null;
  basePath: string;
};

export default function DexClient(props: DexClientProps) {
  return <DexClientClient {...props} />;
}
