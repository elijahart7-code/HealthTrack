import { useEffect, useState } from "react";
import { api } from "../../lib/axios";
import { RECORD_TYPES } from "../../config/recordTypes";
import { Field, Input, Select, Textarea } from "../../components/ui/Input";
import { Badge, EmptyState, Table, Th, Td } from "../../components/ui/Table";

/**
 * Table + form for one clinical record type. It is driven entirely by the
 * shared `RECORD_TYPES` config and renders generic fields without any
 * per-record-type branching.
 */
export function ClinicalRecords({ patientId, type, role, readOnly = false }) {
  const definition = RECORD_TYPES[type];
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [perPage, setPerPage] = useState(10);
  const [form, setForm] = useState({});
  const [recordDate, setRecordDate] = useState(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState(null);

  const canManage = !readOnly && role === "admin";

  async function load() {
    setLoading(true);
    const { data } = await api.get(`/patients/${patientId}/records/${type}`, { params: { perPage } });
    setRecords(data.records);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, perPage]);

  function resetForm() {
    const blank = {};
    Object.keys(definition.fields).forEach((c) => (blank[c] = ""));
    setForm(blank);
    setRecordDate(new Date().toISOString().slice(0, 10));
    setError(null);
  }

  function toggleForm() {
    setShowForm((v) => !v);
    if (showForm) resetForm();
  }

  async function handleSave() {
    setError(null);
    try {
      await api.post(`/patients/${patientId}/records/${type}`, { ...form, recordDate });
      resetForm();
      setShowForm(false);
      load();
    } catch (err) {
      setError(err?.response?.data?.error || "Could not save that record.");
    }
  }

  async function handleDelete(recordId) {
    if (!confirm(`Remove this ${definition.singular.toLowerCase()}? This cannot be undone.`)) return;
    await api.delete(`/patients/${patientId}/records/${type}/${recordId}`);
    load();
  }

  const columnFields = Object.entries(definition.fields).filter(([, f]) => f.column || f.primary);
  const primaryField = Object.entries(definition.fields).find(([, f]) => f.primary);
  const extraFields = columnFields.filter(([key]) => !primaryField || key !== primaryField[0]);

  return (
    <div className="ht-panel">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2>{definition.label}</h2>
        <div className="flex items-center gap-2">
          <span className="ht-pill">{records.length} total</span>
          {canManage && (
            <button type="button" onClick={toggleForm} className="ht-button">
              {showForm ? "Cancel" : `Add ${definition.singular}`}
            </button>
          )}
        </div>
      </div>

      {showForm && canManage && (
        <div className="mb-4 grid gap-3 rounded-xl p-4" style={{ background: "var(--color-surface-muted)" }}>
          {error && <div className="ht-login-alert ht-login-alert-error">{error}</div>}

          {Object.entries(definition.fields).map(([column, field]) => (
            <Field key={column} label={field.label} required={field.required}>
              {field.type === "textarea" ? (
                <Textarea value={form[column] || ""} onChange={(e) => setForm({ ...form, [column]: e.target.value })} />
              ) : field.type === "select" ? (
                <Select value={form[column] || ""} onChange={(e) => setForm({ ...form, [column]: e.target.value })}>
                  <option value="">-- Select --</option>
                  {Object.entries(field.options || {}).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
              ) : (
                <Input type={field.type === "number" ? "number" : "text"} value={form[column] || ""} onChange={(e) => setForm({ ...form, [column]: e.target.value })} />
              )}
            </Field>
          ))}

          <Field label={definition.dateLabel} required>
            <Input type="date" value={recordDate} onChange={(e) => setRecordDate(e.target.value)} max={new Date().toISOString().slice(0, 10)} />
          </Field>

          <div className="flex gap-2">
            <button type="button" onClick={handleSave} className="ht-button">
              Save {definition.singular}
            </button>
            <button type="button" onClick={toggleForm} className="ht-button ht-button-muted">
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="ht-muted text-sm">Loading...</p>
      ) : records.length === 0 ? (
        <EmptyState>No {definition.label.toLowerCase()} recorded for this patient.</EmptyState>
      ) : (
        <>
          <Table>
            <thead>
              <tr>
                <Th>{primaryField?.[1]?.label}</Th>
                {extraFields.map(([column, field]) => (
                  <Th key={column}>{field.label}</Th>
                ))}
                <Th>{definition.dateLabel}</Th>
                {canManage && <Th srOnly>Actions</Th>}
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.record_id}>
                  <Td className="font-bold" style={{ color: "var(--color-brand-strong)" }}>
                    {primaryField ? record[primaryField[0]] : ""}
                  </Td>
                  {extraFields.map(([column, field]) =>
                    field.type === "select" ? (
                      <Td key={column}>
                        {record[column] ? (
                          <Badge>{field.options?.[record[column]] || record[column]}</Badge>
                        ) : (
                          <span className="ht-muted">--</span>
                        )}
                      </Td>
                    ) : (
                      <Td key={column}>{record[column] || "--"}</Td>
                    )
                  )}
                  <Td className="whitespace-nowrap">{new Date(record[definition.dateField]).toLocaleDateString()}</Td>
                  {canManage && (
                    <Td>
                      <button onClick={() => handleDelete(record.record_id)} className="ht-button ht-button-danger">
                        Remove
                      </button>
                    </Td>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>

          {records.length >= perPage && (
            <button onClick={() => setPerPage((p) => p + 10)} className="ht-button ht-button-muted mt-3">
              Show more
            </button>
          )}
        </>
      )}
    </div>
  );
}