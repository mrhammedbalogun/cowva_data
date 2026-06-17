import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { FacilityRow } from "@/lib/types";

export function FacilitiesTable({
  rows,
  onRowClick,
}: {
  rows: FacilityRow[];
  onRowClick?: (facility: string) => void;
}) {
  if (!rows.length) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No facilities for the selected filters.
      </p>
    );
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Facility</TableHead>
          <TableHead>State</TableHead>
          <TableHead className="text-right">Branches</TableHead>
          <TableHead className="text-right">Vaccinations</TableHead>
          <TableHead className="text-right">Completion</TableHead>
          <TableHead className="text-right">Last activity</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r) => (
          <TableRow
            key={r.facility}
            className={onRowClick ? "cursor-pointer" : undefined}
            onClick={onRowClick ? () => onRowClick(r.facility) : undefined}
          >
            <TableCell className="font-medium">{r.facility}</TableCell>
            <TableCell className="text-muted-foreground">{r.state}</TableCell>
            <TableCell className="text-right">{r.branches}</TableCell>
            <TableCell className="text-right">
              {r.vaccinations.toLocaleString()}
            </TableCell>
            <TableCell className="text-right">{r.completionRate}%</TableCell>
            <TableCell className="text-right text-muted-foreground">
              {r.lastActivity}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
