type CellParams = {
  cellId: number;
  value: boolean | null;
  onClick: (key: number) => void;
};

export default function Cell({ cellId, value, onClick }: CellParams) {
  return (
    <div
      className="flex border px-[8px] py-[4px] w-[64px] h-[64px] items-center flex-col justify-center"
      onClick={() => onClick(cellId)}
    >
      {value === null ? "" : value ? "x" : "o"}
    </div>
  );
}
