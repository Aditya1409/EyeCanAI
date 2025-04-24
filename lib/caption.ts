import { BASE_URL } from "@/constants/index"; 

export async function getCaption(imageUri: string) {
    const formData = new FormData();
    const filename = imageUri.split("/").pop()!;
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;
  
    formData.append("file", {
      uri: imageUri,
      name: filename,
      type,
    } as any);
  
    const res = await fetch(`${BASE_URL}/caption`, {
      method: "POST",
      body: formData,
    });
  
    if (!res.ok) throw new Error("Failed to get caption");
    const json = await res.json();
    return json.caption;
  }
  