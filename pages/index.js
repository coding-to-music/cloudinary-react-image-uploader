import { useState } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.scss";
import Image from "next/image";
// const { cloudinary } = require("../config/cloudinary");

// const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
// const apiUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
const apiSecret = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET;
const uploadPreset = "my_preset"; // Your actual upload preset name

// console.log(cloudName);
// console.log(apiKey);
// console.log(apiSecret);

const apiUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload?api_key=${apiKey}&api_secret=${apiSecret}`;

// const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

// const apiUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

// Make your API call and include the `upload_preset` parameter
// const response = await fetch(apiUrl, {
//   method: "POST",
//   body: formData, // Your form data containing the image
//   headers: {
//     "X-Requested-With": "XMLHttpRequest",
//   },
//   // Include the upload preset in the URL
//   query: `upload_preset=${uploadPreset}`,
// });

// Now you can use `apiUrl` wherever you need it, like in your API calls.

export default function Home() {
  const [imageSrc, setImageSrc] = useState();
  const [uploadData, setUploadData] = useState();

  /**
   * handleOnChange
   * @description Triggers when the file input changes (ex: when a file is selected)
   */

  function handleOnChange(changeEvent) {
    const reader = new FileReader();

    reader.onload = function (onLoadEvent) {
      setImageSrc(onLoadEvent.target.result);
      setUploadData(undefined);
    };

    reader.readAsDataURL(changeEvent.target.files[0]);
  }

  /**
   * handleOnSubmit
   * @description Triggers when the main form is submitted
   */

  async function handleOnSubmit(event) {
    event.preventDefault();
    console.log(event.currentTarget);

    const form = event.currentTarget;
    const fileInput = Array.from(form.elements).find(
      ({ name }) => name === "file"
    );

    const formData = new FormData();

    for (const file of fileInput.files) {
      formData.append("file", file);
    }

    formData.append("upload_preset", "unsigned_uploads");

    // "https://api.cloudinary.com/v1_1/[Your Cloudinary Cloud Name]/image/upload",
    const data = await fetch(apiUrl, {
      method: "POST",
      body: formData,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
      // query: `upload_preset=${uploadPreset}`,
    }).then((r) => r.json());

    // console.log("data", data);
    // console.log("response", r);

    setImageSrc(data.secure_url);
    setUploadData(data);
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Image Uploader</title>
        <meta name="description" content="Upload your image to Cloudinary!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Image Uploader</h1>

        <p className={styles.description}>Upload your image to Cloudinary!</p>

        <form
          className={styles.form}
          method="post"
          onChange={handleOnChange}
          onSubmit={handleOnSubmit}
        >
          <p>
            <input type="file" name="file" />
          </p>

          {/* <Image src={imageSrc} alt="new image" /> */}

          {imageSrc && !uploadData && (
            <p>
              <button>Upload Files</button>
            </p>
          )}

          {uploadData && (
            <code>
              <pre>{JSON.stringify(uploadData, null, 2)}</pre>
            </code>
          )}
        </form>
      </main>

      <footer className={styles.footer}>
        <p>
          Find the tutorial on{" "}
          <a href="https://spacejelly.dev/">spacejelly.dev</a>!
        </p>
      </footer>
    </div>
  );
}
