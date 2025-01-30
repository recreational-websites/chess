import { Chess } from "chess.js";
import { enumerate } from "../util/enumerate";

export interface RenderToSvgOptions {
  backgroundColor?: string;
  offset?: number;
  skipSize?: boolean;
  contain?: [width: number, height: number];
}

const CELL_SIZE = 100;

export function renderToSvg(
  FEN: string,
  { backgroundColor, offset = 50, skipSize, contain }: RenderToSvgOptions = {}
): string {
  const svgParts: string[] = [];

  if (contain) {
    const [width, height] = contain;
    svgParts.push(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">`
    );
  } else if (skipSize) {
    svgParts.push(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${
        CELL_SIZE * 8 + offset * 2
      } ${CELL_SIZE * 8 + offset * 2}">`
    );
  } else {
    svgParts.push(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${
        CELL_SIZE * 8 + offset * 2
      } ${CELL_SIZE * 8 + offset * 2}" width="${
        CELL_SIZE * 8 + offset * 2
      }" height="${CELL_SIZE * 8 + offset * 2}">`
    );
  }

  if (backgroundColor && backgroundColor !== "transparent") {
    if (contain) {
      const [width, height] = contain;
      svgParts.push(
        `<rect x="0" y="0" width="${width}" height="${height}" fill="${backgroundColor}" />`
      );
    } else {
      svgParts.push(
        `<rect x="0" y="0" width="${CELL_SIZE + offset * 2}" height="${
          CELL_SIZE + offset * 2
        }" fill="${backgroundColor}" />`
      );
    }
  }

  if (contain) {
    const [containerWidth, containerHeight] = contain;
    const imageWidth = CELL_SIZE + offset * 2;
    const imageHeight = CELL_SIZE + offset * 2;
    const containerAspectRatio = containerWidth / containerHeight;
    const imageAspectRatio = imageWidth / imageHeight;

    let scale,
      translateX = 0,
      translateY = 0;
    if (imageAspectRatio > containerAspectRatio) {
      scale = containerWidth / imageWidth;
    } else {
      scale = containerHeight / imageHeight;
    }
    const scaledImageWidth = imageWidth * scale;
    const scaledImageHeight = imageHeight * scale;
    translateX = (containerWidth - scaledImageWidth) / 2;
    translateY = (containerHeight - scaledImageHeight) / 2;

    svgParts.push(
      `<g transform="translate(${translateX}, ${translateY}) scale(${scale})">`
    );
  }

  const chess = new Chess(FEN);
  for (const [row, y] of enumerate(chess.board())) {
    for (const [cell, x] of enumerate(row)) {
      const rectX = offset + x * CELL_SIZE;
      const rectY = offset + y * CELL_SIZE;
      svgParts.push(
        `<rect x="${rectX}" y="${rectY}" width="${CELL_SIZE}" height="${CELL_SIZE}" fill="${
          y % 2 === x % 2 ? "#ffe9c5" : "#964d22"
        }"/>`
      );
      if (cell) {
        svgParts.push(
          `<text x="${rectX + CELL_SIZE / 2}" y="${
            rectY + CELL_SIZE / 2
          }" font-size="75" text-anchor="middle" alignment-baseline="central" fill="${
            cell.color === "w" ? "#FFF" : "#000"
          }">${cell.type}</text>`
        );
      }
      console.log(y, x);
    }
  }

  if (contain) {
    svgParts.push("</g>");
  }

  svgParts.push("</svg>");

  return svgParts.join("");
}
