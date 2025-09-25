"use client";
type Props = { name?: string; id?: string; className?: string; required?: boolean; defaultValue?: string; value?: string; onChange?: (v: string) => void; };

const materialTypes = [
  { value: "",    label: "Selecione o tipo..." },
  { value: "AL",  label: "Aço / Liga" },
  { value: "AU",  label: "Ouro" },
  { value: "AG",  label: "Prata" },
  { value: "PD",  label: "Paládio" },
  { value: "PT",  label: "Platina" },
  { value: "OT",  label: "Outro" },
];

export default function MaterialTypeSelect({
  name, id, className, required, defaultValue, value, onChange
}: Props) {
  return (
    <select
      name={name}
      id={id}
      className={className ?? "border rounded px-2 py-1 w-full"}
      required={required}
      defaultValue={defaultValue}
      value={value}
      onChange={onChange ? (e) => onChange(e.target.value) : undefined}
    >
      {materialTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
    </select>
  );
}