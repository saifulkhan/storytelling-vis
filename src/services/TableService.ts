import * as d3 from "d3";

// Define the stories and JSON file paths for the tables
const STORY_JSON = {
  "COVID-19: Single Location":
    "/static/storyboards/covid19/numerical-table-1.json",
  "ML: Multivariate": "/static/storyboards/ml/numerical-table-1.json",
};

export function getTables() {
  return Object.keys(STORY_JSON);
}

export async function getTableData(table: string) {
  const file = STORY_JSON[table];
  return await d3.json(file);
}

export async function saveTableData(table: string, data: any) {
  const file = STORY_JSON[table];
  const jsonData = JSON.stringify(data, null, 2);
  //  fs.writeFileSync(file, jsonData);
}

function downloadJSONFile(data: any, filename: string): void {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });

  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.href = url;

  link.download = filename;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
