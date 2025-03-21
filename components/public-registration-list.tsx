import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users } from "lucide-react";

interface Registration {
  _id: string;
  gatheringId: string;
  gatheringTitle: string;
  memberId: string;
  memberName: string;
  groupId: string;
  groupName: string;
  status: string;
  registeredAt: string;
}

// Update the interface to include quota and registrationCount
interface PublicRegistrationListProps {
  registrations: Registration[];
  gatheringId: string;
  gatheringTitle: string;
  quota?: number;
  registrationCount: number;
}

export function PublicRegistrationList({
  registrations,
  gatheringId,
  gatheringTitle,
  quota,
  registrationCount,
}: PublicRegistrationListProps) {
  // Filter registrations for the selected gathering
  const filteredRegistrations = registrations.filter(
    (reg) => reg.gatheringId === gatheringId && reg.status === "confirmed"
  );

  // Group registrations by group
  const registrationsByGroup: Record<string, Registration[]> = {};

  filteredRegistrations.forEach((reg) => {
    if (!registrationsByGroup[reg.groupId]) {
      registrationsByGroup[reg.groupId] = [];
    }
    registrationsByGroup[reg.groupId].push(reg);
  });

  // Sort groups by name
  const sortedGroups = Object.entries(registrationsByGroup).sort(([, regsA], [, regsB]) => {
    return regsA[0].groupName.localeCompare(regsB[0].groupName);
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">{gatheringTitle}</CardTitle>
            <CardDescription className="mt-2">
              <span className="inline-flex items-center mr-4 text-sm">
                <Users className="h-4 w-4 mr-1" />
                {filteredRegistrations.length} orang terdaftar
              </span>
              {quota && (
                <span className="inline-flex items-center text-sm">
                  <span className={registrationCount >= quota ? "text-red-500" : "text-green-500"}>
                    {registrationCount} / {quota} Kapasitas
                  </span>
                  {registrationCount >= quota && <span className="ml-2 text-red-500 font-medium">(Full)</span>}
                </span>
              )}
            </CardDescription>
          </div>
          <Badge className="text-sm px-3 py-1">{filteredRegistrations.length} Prodiakon/Prodiakones</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {filteredRegistrations.length === 0 ? (
          <div className="text-center py-8 border rounded-md bg-muted/30">
            <p className="text-muted-foreground">Belum ada yang mendaftar.</p>
            <p className="text-sm text-muted-foreground mt-1">Jadilah yang pertama mendaftar!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedGroups.map(([groupId, regs]) => (
              <div key={groupId} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-lg flex items-center">
                    {regs[0].groupName}
                    <Badge variant="outline" className="ml-2">
                      {regs.length}
                    </Badge>
                  </h3>
                </div>
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead className="hidden md:table-cell">Tanggal Mendaftar</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {regs.map((reg) => (
                        <TableRow key={reg._id}>
                          <TableCell width={600} className="font-medium">
                            {reg.memberName}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {new Intl.DateTimeFormat("id-ID", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            }).format(new Date(reg.registeredAt))}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
