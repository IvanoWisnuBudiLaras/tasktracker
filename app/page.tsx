"use client";
import {useEffect, useRef} from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

export default function MainMenu() {
  const quillRef = useRef<Quill | null>(null);

  useEffect(() => {
    quillRef.current = new Quill('#editor', {
      modules: {
        toolbar: [
          [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline'],
          ['image', 'code-block'],
        ],
      },
      placeholder: 'Describe',
      theme: 'snow', // or 'bubble'
    });
  }, []); 
  return (
    <>
      <input />
      <div id="editor"></div>
    </>
  );
}
