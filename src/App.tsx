import * as React from "react";
import "./styles.css";

enum ArrowKeys {
  Right = 39,
  Down = 40,
  Left = 37,
  Up = 38
}

type Coord = [number, number];

function getHighlightClass(
  row: number,
  column: number,
  highlight: Coord
): string {
  if (row === highlight[0] && column === highlight[1]) {
    return "HighlightProduct";
  }

  if (column === 1) {
    return row <= highlight[0] ? "HighlightMultiplier" : "HighlightAxis";
  }

  if (row === 1) {
    return column <= highlight[1] ? "HighlightMultiplier" : "HighlightAxis";
  }

  if (row > 1 && column > 1 && row <= highlight[0] && column <= highlight[1]) {
    return "HighlightRowOrColumn";
  }

  return "";
}

export default function App() {
  const [highlight, setHighlight] = React.useState<Coord>([1, 1]);

  const onKeyDown = React.useCallback((event: KeyboardEvent) => {
    switch (event.keyCode) {
      case ArrowKeys.Right:
        setHighlight(([r, c]) => [r, Math.min(c + 1, 12)]);
        break;
      case ArrowKeys.Down:
        setHighlight(([r, c]) => [Math.min(r + 1, 12), c]);
        break;
      case ArrowKeys.Left:
        setHighlight(([r, c]) => [r, Math.max(c - 1, 1)]);
        break;
      case ArrowKeys.Up:
        setHighlight(([r, c]) => [Math.max(r - 1, 1), c]);
        break;
    }
  }, []);

  const onClickCell: React.MouseEventHandler = (e) => {
    const coordClicked = e.currentTarget.getAttribute("data-coord");
    if (coordClicked) {
      const coord = coordClicked
        .split(",")
        .map((v) => parseInt(v, 10)) as Coord;

      if (coord[0] > 1 && coord[1] > 1) {
        setHighlight(coord);
        return;
      }

      if (coord[0] === 1 && coord[1] === 1) {
        setHighlight([1, 1]);
        return;
      }

      if (coord[0] === 1) {
        setHighlight(([r, c]) => [r, coord[1]]);
        return;
      }

      setHighlight(([r, c]) => [coord[0], c]);
    }
  };

  React.useEffect(() => {
    document.body.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.removeEventListener("keydown", onKeyDown);
    };
  }, [onKeyDown]);

  const highlightOutlineStyle = {
    gridRowStart: 1,
    gridColumnStart: 1,
    gridRowEnd: highlight[0] + 1,
    gridColumnEnd: highlight[1] + 1
  };

  return (
    <div className="App">
      <div className="HighlightOutline" style={highlightOutlineStyle} />
      {Array.from({ length: 12 }).map((_, r) =>
        Array.from({ length: 12 }).map((_, c) => {
          const rw = r + 1;
          const col = c + 1;
          const strCoord = `${rw},${col}`;
          const product = rw * col;
          const gridCellStyle = {
            gridRow: rw,
            gridColumn: col
          };

          const className = ["Cell", getHighlightClass(rw, col, highlight)]
            .filter((i) => i)
            .join(" ");

          return (
            <div
              key={strCoord}
              data-coord={strCoord}
              className={className}
              style={gridCellStyle}
              onClick={onClickCell}
            >
              {product}
            </div>
          );
        })
      )}
    </div>
  );
}
