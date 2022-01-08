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

  if (column === 1 && row <= highlight[0]) {
    return "HighlightMultiplier";
  }

  if (row === 1 && column <= highlight[1]) {
    return "HighlightMultiplier";
  }

  if (row > 1 && column > 1 && row <= highlight[0] && column <= highlight[1]) {
    return "HighlightRowOrColumn";
  }

  return "";
}

function getBorderClasses(
  row: number,
  column: number,
  highlight: Coord
): string {
  const classes: string[] = [];

  // Top border?
  if (row === 1 && column <= highlight[1]) {
    classes.push("BorderTop");
  }

  // Left border?
  if (column === 1 && row <= highlight[0]) {
    classes.push("BorderLeft");
  }

  // Bottom border?
  if (row === highlight[0] && column <= highlight[1]) {
    classes.push("BorderBottom");
  }

  // Right border?
  if (column === highlight[1] && row <= highlight[0]) {
    classes.push("BorderRight");
  }

  return classes.join(" ");
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

  return (
    <div className="App">
      {Array.from({ length: 12 }).map((_, r) => (
        <div key={r} className="Row">
          {Array.from({ length: 12 }).map((_, c) => (
            <div
              key={c}
              className={
                "Cell " +
                getHighlightClass(r + 1, c + 1, highlight) +
                " " +
                getBorderClasses(r + 1, c + 1, highlight)
              }
              data-coord={`${r + 1},${c + 1}`}
              onClick={onClickCell}
            >
              {(r + 1) * (c + 1)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
