#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs::OpenOptions;
use std::io::Write;

#[tauri::command]
fn append_chunk_to_file(path: String, chunk: Vec<u8>) -> Result<(), String> {
    let mut file = OpenOptions::new()
        .create(true)
        .append(true)
        .open(&path)
        .map_err(|e| e.to_string())?;

    file.write_all(&chunk).map_err(|e| e.to_string())?;

    Ok(())
}

fn main() {
tauri::Builder::default()
	.invoke_handler(tauri::generate_handler![append_chunk_to_file])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}