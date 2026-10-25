---
title: Image Library
sidebar_position: 3
description: REST API endpoints for Image Library
---

# Image Library

## GET `/image-library/v1`

**List all images**

Returns every image in the image library, sorted by name.

**Required scope:** `read`

**Example:**

`GET /api/v2/image-library/v1`

**Response body:**

```json
{
	"data": [
		{
			"name": "logo",
			"description": "Company logo",
			"variable": "$(image:logo)",
			"mimeType": "image/png",
			"originalSize": 24512,
			"previewSize": 3120,
			"revision": "3f786850e387550fdab836ed7e6dc881de23001b",
			"urls": {
				"original": "/api/v2/image-library/v1/logo/data/original/3f786850e387550fdab836ed7e6dc881de23001b",
				"preview": "/api/v2/image-library/v1/logo/data/preview/3f786850e387550fdab836ed7e6dc881de23001b"
			},
			"backgroundColor": "rgba(0, 0, 0, 0)",
			"createdAt": 1767225600000,
			"modifiedAt": 1767225600000
		}
	],
	"meta": {
		"total": 1,
		"limit": 100,
		"offset": 0
	}
}
```

**Successful response** (`200`) — List of images

Response body (collection):

| Field                    | Type             | Description                                                                                                                                   |
| ------------------------ | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                   | `string`         | Unique name of the image. Only letters, numbers, underscores and dashes.                                                                      |
| `description`            | `string`         | Description of the image.                                                                                                                     |
| `variable`               | `string`         | Variable to use in a button to reference this image.                                                                                          |
| `mimeType`               | `string \| null` | Content type of the uploaded image, or null if no image data has been uploaded yet.                                                           |
| `originalSize`           | `number`         | Size of the uploaded image in bytes.                                                                                                          |
| `previewSize`            | `number`         | Size of the preview image in bytes.                                                                                                           |
| `revision`               | `string \| null` | Opaque identifier of the current image data, which changes whenever the data is replaced, or null if no image data has been uploaded yet.     |
| `urls`                   | `object \| null` | URLs to fetch the image data from, or null if no image data has been uploaded yet. These include the revision, so can be cached indefinitely. |
| &nbsp;&nbsp;↳ `original` | `string`         | URL of the image as uploaded. Changes whenever the image data changes.                                                                        |
| &nbsp;&nbsp;↳ `preview`  | `string`         | URL of a small WebP preview of the image. Changes whenever the image data changes.                                                            |
| `backgroundColor`        | `string`         | CSS color shown behind the image when previewing it in the UI.                                                                                |
| `createdAt`              | `number`         | Time the image was created, in milliseconds since the epoch.                                                                                  |
| `modifiedAt`             | `number`         | Time the image data was last replaced, in milliseconds since the epoch. Editing the details of the image does not change this.                |

---

## POST `/image-library/v1`

**Create an image**

Create a new, empty image. Upload its data with the set image data endpoint. The name is sanitised, so check the name in the response.

**Required scope:** `write`

**Request body** (`application/json`):

| Field         | Type     | Required | Description                                                                                                       |
| ------------- | -------- | -------- | ----------------------------------------------------------------------------------------------------------------- |
| `name`        | `string` | Yes      | Name for the image. Characters other than letters, numbers, underscores and dashes are replaced with underscores. |
| `description` | `string` | No       | Description of the image.                                                                                         |

**Example:**

`POST /api/v2/image-library/v1`

**Request body:**

```json
{
	"name": "logo",
	"description": "Company logo"
}
```

**Response body:**

```json
{
	"data": {
		"name": "logo",
		"description": "Company logo",
		"variable": "$(image:logo)",
		"mimeType": "image/png",
		"originalSize": 24512,
		"previewSize": 3120,
		"revision": "3f786850e387550fdab836ed7e6dc881de23001b",
		"urls": {
			"original": "/api/v2/image-library/v1/logo/data/original/3f786850e387550fdab836ed7e6dc881de23001b",
			"preview": "/api/v2/image-library/v1/logo/data/preview/3f786850e387550fdab836ed7e6dc881de23001b"
		},
		"backgroundColor": "rgba(0, 0, 0, 0)",
		"createdAt": 1767225600000,
		"modifiedAt": 1767225600000
	}
}
```

**Successful response** — Image created

Response body:

| Field                    | Type             | Description                                                                                                                                   |
| ------------------------ | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                   | `string`         | Unique name of the image. Only letters, numbers, underscores and dashes.                                                                      |
| `description`            | `string`         | Description of the image.                                                                                                                     |
| `variable`               | `string`         | Variable to use in a button to reference this image.                                                                                          |
| `mimeType`               | `string \| null` | Content type of the uploaded image, or null if no image data has been uploaded yet.                                                           |
| `originalSize`           | `number`         | Size of the uploaded image in bytes.                                                                                                          |
| `previewSize`            | `number`         | Size of the preview image in bytes.                                                                                                           |
| `revision`               | `string \| null` | Opaque identifier of the current image data, which changes whenever the data is replaced, or null if no image data has been uploaded yet.     |
| `urls`                   | `object \| null` | URLs to fetch the image data from, or null if no image data has been uploaded yet. These include the revision, so can be cached indefinitely. |
| &nbsp;&nbsp;↳ `original` | `string`         | URL of the image as uploaded. Changes whenever the image data changes.                                                                        |
| &nbsp;&nbsp;↳ `preview`  | `string`         | URL of a small WebP preview of the image. Changes whenever the image data changes.                                                            |
| `backgroundColor`        | `string`         | CSS color shown behind the image when previewing it in the UI.                                                                                |
| `createdAt`              | `number`         | Time the image was created, in milliseconds since the epoch.                                                                                  |
| `modifiedAt`             | `number`         | Time the image data was last replaced, in milliseconds since the epoch. Editing the details of the image does not change this.                |

---

## GET `/image-library/v1/{imageName}`

**Get an image**

Returns the details of a single image. Fetch the image itself from one of its urls.

**Required scope:** `read`

**Parameters:**

| Parameter   | In   | Type     | Description                                          |
| ----------- | ---- | -------- | ---------------------------------------------------- |
| `imageName` | path | `string` | Image name, as returned by the list images endpoint. |

**Example:**

`GET /api/v2/image-library/v1/logo`

**Response body:**

```json
{
	"data": {
		"name": "logo",
		"description": "Company logo",
		"variable": "$(image:logo)",
		"mimeType": "image/png",
		"originalSize": 24512,
		"previewSize": 3120,
		"revision": "3f786850e387550fdab836ed7e6dc881de23001b",
		"urls": {
			"original": "/api/v2/image-library/v1/logo/data/original/3f786850e387550fdab836ed7e6dc881de23001b",
			"preview": "/api/v2/image-library/v1/logo/data/preview/3f786850e387550fdab836ed7e6dc881de23001b"
		},
		"backgroundColor": "rgba(0, 0, 0, 0)",
		"createdAt": 1767225600000,
		"modifiedAt": 1767225600000
	}
}
```

**Successful response** (`200`) — The requested image

Response body:

| Field                    | Type             | Description                                                                                                                                   |
| ------------------------ | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                   | `string`         | Unique name of the image. Only letters, numbers, underscores and dashes.                                                                      |
| `description`            | `string`         | Description of the image.                                                                                                                     |
| `variable`               | `string`         | Variable to use in a button to reference this image.                                                                                          |
| `mimeType`               | `string \| null` | Content type of the uploaded image, or null if no image data has been uploaded yet.                                                           |
| `originalSize`           | `number`         | Size of the uploaded image in bytes.                                                                                                          |
| `previewSize`            | `number`         | Size of the preview image in bytes.                                                                                                           |
| `revision`               | `string \| null` | Opaque identifier of the current image data, which changes whenever the data is replaced, or null if no image data has been uploaded yet.     |
| `urls`                   | `object \| null` | URLs to fetch the image data from, or null if no image data has been uploaded yet. These include the revision, so can be cached indefinitely. |
| &nbsp;&nbsp;↳ `original` | `string`         | URL of the image as uploaded. Changes whenever the image data changes.                                                                        |
| &nbsp;&nbsp;↳ `preview`  | `string`         | URL of a small WebP preview of the image. Changes whenever the image data changes.                                                            |
| `backgroundColor`        | `string`         | CSS color shown behind the image when previewing it in the UI.                                                                                |
| `createdAt`              | `number`         | Time the image was created, in milliseconds since the epoch.                                                                                  |
| `modifiedAt`             | `number`         | Time the image data was last replaced, in milliseconds since the epoch. Editing the details of the image does not change this.                |

---

## PATCH `/image-library/v1/{imageName}`

**Update an image**

Update the details of an image. Renaming an image changes its variable, so buttons using the old name will no longer show it.

**Required scope:** `write`

**Parameters:**

| Parameter   | In   | Type     | Description                                          |
| ----------- | ---- | -------- | ---------------------------------------------------- |
| `imageName` | path | `string` | Image name, as returned by the list images endpoint. |

**Request body** (`application/json`):

| Field             | Type     | Required | Description                                                                                                       |
| ----------------- | -------- | -------- | ----------------------------------------------------------------------------------------------------------------- |
| `name`            | `string` | No       | Name for the image. Characters other than letters, numbers, underscores and dashes are replaced with underscores. |
| `description`     | `string` | No       | Description of the image.                                                                                         |
| `backgroundColor` | `string` | No       | CSS color shown behind the image when previewing it in the UI.                                                    |

**Example:**

`PATCH /api/v2/image-library/v1/logo`

**Request body:**

```json
{
	"name": "new_logo",
	"description": "Company logo",
	"backgroundColor": "#000000"
}
```

**Response body:**

```json
{
	"data": {
		"name": "logo",
		"description": "Company logo",
		"variable": "$(image:logo)",
		"mimeType": "image/png",
		"originalSize": 24512,
		"previewSize": 3120,
		"revision": "3f786850e387550fdab836ed7e6dc881de23001b",
		"urls": {
			"original": "/api/v2/image-library/v1/logo/data/original/3f786850e387550fdab836ed7e6dc881de23001b",
			"preview": "/api/v2/image-library/v1/logo/data/preview/3f786850e387550fdab836ed7e6dc881de23001b"
		},
		"backgroundColor": "rgba(0, 0, 0, 0)",
		"createdAt": 1767225600000,
		"modifiedAt": 1767225600000
	}
}
```

**Successful response** (`200`) — Updated image

Response body:

| Field                    | Type             | Description                                                                                                                                   |
| ------------------------ | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                   | `string`         | Unique name of the image. Only letters, numbers, underscores and dashes.                                                                      |
| `description`            | `string`         | Description of the image.                                                                                                                     |
| `variable`               | `string`         | Variable to use in a button to reference this image.                                                                                          |
| `mimeType`               | `string \| null` | Content type of the uploaded image, or null if no image data has been uploaded yet.                                                           |
| `originalSize`           | `number`         | Size of the uploaded image in bytes.                                                                                                          |
| `previewSize`            | `number`         | Size of the preview image in bytes.                                                                                                           |
| `revision`               | `string \| null` | Opaque identifier of the current image data, which changes whenever the data is replaced, or null if no image data has been uploaded yet.     |
| `urls`                   | `object \| null` | URLs to fetch the image data from, or null if no image data has been uploaded yet. These include the revision, so can be cached indefinitely. |
| &nbsp;&nbsp;↳ `original` | `string`         | URL of the image as uploaded. Changes whenever the image data changes.                                                                        |
| &nbsp;&nbsp;↳ `preview`  | `string`         | URL of a small WebP preview of the image. Changes whenever the image data changes.                                                            |
| `backgroundColor`        | `string`         | CSS color shown behind the image when previewing it in the UI.                                                                                |
| `createdAt`              | `number`         | Time the image was created, in milliseconds since the epoch.                                                                                  |
| `modifiedAt`             | `number`         | Time the image data was last replaced, in milliseconds since the epoch. Editing the details of the image does not change this.                |

---

## DELETE `/image-library/v1/{imageName}`

**Delete an image**

Delete an image. Buttons using it will no longer show it.

**Required scope:** `write`

**Parameters:**

| Parameter   | In   | Type     | Description                                          |
| ----------- | ---- | -------- | ---------------------------------------------------- |
| `imageName` | path | `string` | Image name, as returned by the list images endpoint. |

**Example:**

`DELETE /api/v2/image-library/v1/logo`

**Successful response** — Image deleted

---

## GET `/image-library/v1/{imageName}/data/{variant}/{revision}`

**Get image data**

Returns the raw image. Use the urls from the image rather than building this path: they contain the revision of the current data, so can be cached indefinitely. Once the image data changes, the old urls return 404.

**Required scope:** `read`

**Parameters:**

| Parameter   | In   | Type     | Description                                                                 |
| ----------- | ---- | -------- | --------------------------------------------------------------------------- |
| `imageName` | path | `string` | Image name, as returned by the list images endpoint.                        |
| `variant`   | path | `string` | Which version of the image to fetch. The preview is a small WebP thumbnail. |
| `revision`  | path | `string` | Revision of the image data, as included in the image urls.                  |

**Example:**

`GET /api/v2/image-library/v1/logo/data/original/3f786850e387550fdab836ed7e6dc881de23001b`

**Successful response** (`200`) — The image

Response body: the raw file, as `image/png`, `image/jpeg`, `image/gif`, `image/webp`, `image/svg+xml`

---

## PUT `/image-library/v1/{imageName}/data`

**Set image data**

Replace the image data with the raw image file in the request body. Buttons using the image update to show the new image.

**Required scope:** `write`

**Parameters:**

| Parameter   | In   | Type     | Description                                          |
| ----------- | ---- | -------- | ---------------------------------------------------- |
| `imageName` | path | `string` | Image name, as returned by the list images endpoint. |

**Request body** (`image/png`, `image/jpeg`, `image/gif`, `image/webp`, `image/svg+xml`):

The raw image file, with a Content-Type matching its format. At most 7863296 bytes.

**Example:**

`PUT /api/v2/image-library/v1/logo/data`

**Response body:**

```json
{
	"data": {
		"name": "logo",
		"description": "Company logo",
		"variable": "$(image:logo)",
		"mimeType": "image/png",
		"originalSize": 24512,
		"previewSize": 3120,
		"revision": "3f786850e387550fdab836ed7e6dc881de23001b",
		"urls": {
			"original": "/api/v2/image-library/v1/logo/data/original/3f786850e387550fdab836ed7e6dc881de23001b",
			"preview": "/api/v2/image-library/v1/logo/data/preview/3f786850e387550fdab836ed7e6dc881de23001b"
		},
		"backgroundColor": "rgba(0, 0, 0, 0)",
		"createdAt": 1767225600000,
		"modifiedAt": 1767225600000
	}
}
```

**Successful response** (`200`) — Updated image

Response body:

| Field                    | Type             | Description                                                                                                                                   |
| ------------------------ | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                   | `string`         | Unique name of the image. Only letters, numbers, underscores and dashes.                                                                      |
| `description`            | `string`         | Description of the image.                                                                                                                     |
| `variable`               | `string`         | Variable to use in a button to reference this image.                                                                                          |
| `mimeType`               | `string \| null` | Content type of the uploaded image, or null if no image data has been uploaded yet.                                                           |
| `originalSize`           | `number`         | Size of the uploaded image in bytes.                                                                                                          |
| `previewSize`            | `number`         | Size of the preview image in bytes.                                                                                                           |
| `revision`               | `string \| null` | Opaque identifier of the current image data, which changes whenever the data is replaced, or null if no image data has been uploaded yet.     |
| `urls`                   | `object \| null` | URLs to fetch the image data from, or null if no image data has been uploaded yet. These include the revision, so can be cached indefinitely. |
| &nbsp;&nbsp;↳ `original` | `string`         | URL of the image as uploaded. Changes whenever the image data changes.                                                                        |
| &nbsp;&nbsp;↳ `preview`  | `string`         | URL of a small WebP preview of the image. Changes whenever the image data changes.                                                            |
| `backgroundColor`        | `string`         | CSS color shown behind the image when previewing it in the UI.                                                                                |
| `createdAt`              | `number`         | Time the image was created, in milliseconds since the epoch.                                                                                  |
| `modifiedAt`             | `number`         | Time the image data was last replaced, in milliseconds since the epoch. Editing the details of the image does not change this.                |

---
