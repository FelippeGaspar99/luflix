// Test script to verify Google Drive URL parsing
const url = "https://drive.google.com/file/d/1D_hF3ueyW-YA9v25BU2d_NIyDk5zfYBY/view?usp=sharing";

const parsed = new URL(url);
const hostname = parsed.hostname;

console.log("Original URL:", url);
console.log("Hostname:", hostname);
console.log("Pathname:", parsed.pathname);

const idFromPath = parsed.pathname.split("/d/")[1]?.split("/")[0];
const idFromQuery = parsed.searchParams.get("id");
const fileId = idFromPath ?? idFromQuery;

console.log("ID from path:", idFromPath);
console.log("ID from query:", idFromQuery);
console.log("Final ID:", fileId);

if (fileId) {
    const embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
    console.log("Embed URL:", embedUrl);
}
