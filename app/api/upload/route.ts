// app/api/upload/route.ts
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  console.log("Upload API route called");
  
  try {
    // Create upload directory
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    console.log("Upload directory ensured:", uploadDir);
    
    // Log request headers for debugging
    console.log("Request headers:", Object.fromEntries(req.headers.entries()));
    
    // Get and log content type
    const contentType = req.headers.get("content-type") || "";
    console.log("Content-Type:", contentType);
    
    // Check if this is a multipart form
    if (!contentType.includes("multipart/form-data")) {
      console.log("Not a multipart form data request");
      return NextResponse.json({ 
        error: "Request must be multipart/form-data" 
      }, { status: 400 });
    }
    
    try {
      // Try to parse form data
      const formData = await req.formData();
      console.log("Form data keys:", Array.from(formData.keys()));
      
      // Check for file field
      if (!formData.has("file")) {
        console.log("No 'file' field in form data");
        return NextResponse.json({ 
          error: "No file field in form data",
          availableFields: Array.from(formData.keys())
        }, { status: 400 });
      }
      
      // Extract file
      const file = formData.get("file");
      
      // Check if file is a File object
      if (!(file instanceof File)) {
        console.log("'file' field is not a File object:", typeof file);
        return NextResponse.json({ 
          error: "File field is not a valid File object",
          fileType: typeof file
        }, { status: 400 });
      }
      
      console.log("File received:", {
        name: file.name,
        type: file.type,
        size: file.size
      });
      
      // Generate unique filename
      const uniqueId = uuidv4();
      const fileExtension = path.extname(file.name);
      const fileName = `${uniqueId}${fileExtension}`;
      const filePath = path.join(uploadDir, fileName);
      
      // Save file
      const fileBuffer = await file.arrayBuffer();
      await writeFile(filePath, Buffer.from(fileBuffer));
      console.log("File saved to:", filePath);
      
      // Return success response
      return NextResponse.json({
        id: uniqueId,
        filename: file.name,
        url: `/uploads/${fileName}`,
        mimetype: file.type,
        size: file.size
      });
      
    } catch (formError) {
      console.error("Error parsing form data:", formError);
      return NextResponse.json({ 
        error: "Failed to parse form data",
        details: (formError as Error).message 
      }, { status: 400 });
    }
    
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ 
      error: "Server error",
      details: (error as Error).message 
    }, { status: 500 });
  }
}