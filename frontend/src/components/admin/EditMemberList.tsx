import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { Check, Loader2, X, Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface Props {
  fields: EventField[];
  members: EventMember[];
}

interface DataCellProps {
  field: EventField;
  memberId: string | number;
  value: any;
  onSave: (
    memberId: EventMember["id"],
    key: string,
    value: any
  ) => Promise<void>;
}

const DataCell: React.FC<DataCellProps> = ({
  field,
  memberId,
  value: initial,
  onSave,
}) => {
  const [val, setVal] = useState<any>(initial ?? "");
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);

  const saveCell = async () => {
    if (!dirty || saving) return;
    setSaving(true);
    setError(false);
    try {
      await onSave(memberId, field.fieldKey, val);
      setDirty(false);
    } catch {
      setError(true);
    } finally {
      setSaving(false);
    }
  };

  const onEdit = (v: any) => {
    setVal(v);
    setDirty(true);
    setError(false);
  };

  const renderEditor = () => {
    switch (field.dataType) {
      case "number":
        return (
          <Input type="number" value={val} onChange={(e) => onEdit(Number(e.target.value))} />
        );
      case "boolean":
        return (
          <Switch checked={Boolean(val)} onCheckedChange={onEdit} />
        );
      case "date":
        return (
          <Input
            type="date"
            value={val ? String(val).substring(0, 10) : ""}
            onChange={(e) => onEdit(e.target.value)}
          />
        );
      case "enum":
        return (
          <Select value={val ?? ""} onValueChange={onEdit}>
            <SelectTrigger>
              <SelectValue placeholder="선택" />
            </SelectTrigger>
            <SelectContent>
              {field.enumOptions?.map((opt, i) => (
                <SelectItem key={i} value={opt.name || "-"}>
                  {opt.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return (
          <Input type="text" value={val} onChange={(e) => onEdit(e.target.value)} />
        );
    }
  };

  const renderStatusIcon = () => {
    if (saving) return <Loader2 className="w-4 h-4 animate-spin" />;
    if (error)
      return <X className="w-4 h-4 text-red-500 cursor-pointer" onClick={saveCell} title="Retry" />;
    return (
      <Check
        className={`w-4 h-4 text-green-600 cursor-pointer ${dirty ? "" : "invisible"}`}
        onClick={saveCell}
      />
    );
  };

  return (
    <div className="flex items-center space-x-2">
      {renderEditor()}
      <Button className="shrink-0" onClick={saveCell} disabled={!dirty || saving}>
        {renderStatusIcon()}
      </Button>
    </div>
  );
};

/* ---------- Main ---------- */
const EditMemberList: React.FC<Props> = ({ fields, members }) => {
  const [rows, setRows] = useState<EventMember[]>(members);
  /* 신규 행 저장 상태 */
  const [rowSaving, setRowSaving] = useState<Record<string, "idle" | "saving" | "error">>({});
  /* 삭제 상태 */
  const [rowDeleting, setRowDeleting] = useState<Record<string, boolean>>({});

  const sortedFields = [...fields].sort((a, b) => a.order - b.order);

  /* 셀 단위 저장 */
  const saveField = async (
    memberId: EventMember["id"],
    key: string,
    value: any
  ) => {
    /* TODO: API.patch */
    setRows((prev) =>
      prev.map((m) =>
        m.id === memberId ? { ...m, data: { ...m.data, [key]: value } } : m
      )
    );
  };

  /* 행 추가 */
  const addRow = () => {
    const id = `TEMP_${Date.now()}`;
    const blank: Record<string, any> = {};
    sortedFields.forEach((f) => (blank[f.fieldKey] = ""));
    setRows((prev) => [{ id, data: blank } as unknown as EventMember, ...prev]);
    setRowSaving((prev) => ({ ...prev, [id]: "idle" }));
  };

  /* 신규 행 저장 */
  const saveNewRow = async (tempMember: EventMember) => {
    const id = tempMember.id;
    setRowSaving((p) => ({ ...p, [id]: "saving" }));
    try {
      /* TODO: API.post */
      const realId = Date.now();
      setRows((prev) => prev.map((m) => (m.id === id ? { ...m, id: realId } : m)));
      setRowSaving((p) => {
        const { [id]: _omit, ...rest } = p;
        return rest;
      });
    } catch {
      setRowSaving((p) => ({ ...p, [id]: "error" }));
    }
  };

  /* 멤버 삭제 */
  const deleteMember = async (memberId: EventMember["id"]) => {
    const isTemp = String(memberId).startsWith("TEMP_");
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    if (isTemp) {
      /* 임시행은 로컬에서만 제거 */
      setRows((prev) => prev.filter((m) => m.id !== memberId));
      return;
    }
    setRowDeleting((p) => ({ ...p, [memberId]: true }));
    try {
      /* TODO: API.delete(`/members/${memberId}`) */
      setRows((prev) => prev.filter((m) => m.id !== memberId));
    } catch {
      alert("삭제 실패");
    } finally {
      setRowDeleting((p) => ({ ...p, [memberId]: false }));
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-end mb-2">
        <Button size="icon" onClick={addRow}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <Table className="min-w-full border rounded-lg">
        <TableHeader>
          <TableRow>
            <TableHead className="w-12" /> {/* actions */}
            {sortedFields.map((f) => (
              <TableHead key={f.fieldKey}>{f.fieldKey}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((member) => {
            const isTemp = String(member.id).startsWith("TEMP_");
            const savingState = rowSaving[member.id];
            const deleting = rowDeleting[member.id];
            return (
              <TableRow key={member.id} className={deleting ? "opacity-50" : ""}>
                <TableCell className="w-12 space-x-1 flex items-center">
                  {/* 신규 행 저장 */}
                  {isTemp ? (
                    savingState === "saving" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => saveNewRow(member)}
                        disabled={savingState === "error" ? false : false}
                      >
                        {savingState === "error" ? (
                          <X className="w-4 h-4 text-red-500" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                      </Button>
                    )
                  ) : null}

                  {/* 삭제 버튼 */}
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => deleteMember(member.id)}
                    disabled={deleting}
                  >
                    {deleting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </Button>
                </TableCell>

                {/* 데이터 셀 */}
                {sortedFields.map((f) => (
                  <TableCell key={`${member.id}-${f.fieldKey}`}>
                    {isTemp ? (
                      <Input
                        value={member.data?.[f.fieldKey] || ""}
                        onChange={(e) =>
                          setRows((prev) =>
                            prev.map((m) =>
                              m.id === member.id
                                ? {
                                    ...m,
                                    data: { ...m.data, [f.fieldKey]: e.target.value },
                                  }
                                : m
                            )
                          )
                        }
                      />
                    ) : (
                      <DataCell
                        field={f}
                        memberId={member.id}
                        value={member.data?.[f.fieldKey]}
                        onSave={saveField}
                      />
                    )}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default EditMemberList;
