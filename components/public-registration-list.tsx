/* eslint-disable @typescript-eslint/no-unused-vars */
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

interface PublicRegistrationListProps {
  registrations: Registration[];
  gatheringId: string;
  gatheringTitle: string;
}

export function PublicRegistrationList({ registrations, gatheringId, gatheringTitle }: PublicRegistrationListProps) {
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

  // Format date for display
  // const formatDate = (dateString: string) => {
  //   return new Date(dateString).toLocaleDateString();
  // };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">{gatheringTitle}</CardTitle>
            <CardDescription className="mt-2">
              <span className="inline-flex items-center mr-4">
                <Users className="h-4 w-4 mr-1" />
                {filteredRegistrations.length} Prodikon terdaftar
              </span>
            </CardDescription>
          </div>
          <Badge className="text-sm px-3 py-1">{filteredRegistrations.length} Prodiakon/Prodiakones</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {filteredRegistrations.length === 0 ? (
          <div className="text-center py-8 border rounded-md bg-muted/30">
            <p className="text-muted-foreground">Belum ada yang mendaftar untuk tugas misa ini.</p>
            <p className="text-sm text-muted-foreground mt-1">Jadilah pertama yang mendaftar!</p>
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
                        <TableHead className="hidden md:table-cell">Registered On</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {regs.map((reg) => (
                        <TableRow key={reg._id}>
                          <TableCell className="font-medium">{reg.memberName}</TableCell>
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
