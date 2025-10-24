/**
 * PlaceCats API Client
 * A simple interface for the PlaceCats placeholder image service
 * API Documentation: https://www.placecats.com/
 */

type PlaceCatsEndpoint =
  | "neo"
  | "millie"
  | "millie_neo"
  | "neo_banana"
  | "neo_2"
  | "bella"
  | "g"; // grayscale

interface PlaceCatsOptions {
  fit?: "cover" | "contain" | "fill" | "inside" | "outside";
  position?: "center" | "top" | "left" | "right" | "bottom";
}

export class PlaceCatsAPI {
  private readonly BASE_URL = "https://placecats.com";
  private readonly endpoints: PlaceCatsEndpoint[] = [
    "neo",
    "millie",
    "millie_neo",
    "neo_banana",
    "neo_2",
    "bella",
    "g",
  ];

  /**
   * Retrieve a specific photo from a full endpoint URL
   * @param url - The full PlaceCats URL (e.g., "https://placecats.com/neo/300/200")
   * @returns The URL (for consistency with other methods)
   */
  getPhotoFromUrl(url: string): string {
    // Validate that it's a PlaceCats URL
    if (!url.startsWith(this.BASE_URL)) {
      throw new Error(
        `Invalid PlaceCats URL. Must start with ${this.BASE_URL}`
      );
    }
    return url;
  }

  /**
   * Retrieve a random photo with a fixed size from a random endpoint
   * @param width - Image width in pixels
   * @param height - Image height in pixels
   * @param options - Optional fit and position parameters
   * @returns The generated PlaceCats URL
   */
  getRandomPhoto(
    width: number,
    height: number,
    options?: PlaceCatsOptions
  ): string {
    const endpoint = this.getRandomEndpoint();
    return this.buildUrl(endpoint, width, height, options);
  }

  /**
   * Retrieve multiple random photos with random sizes from random endpoints
   * @param count - Number of photos to generate (defaults to 5)
   * @param minSize - Minimum width/height (defaults to 200)
   * @param maxSize - Maximum width/height (defaults to 600)
   * @returns Array of PlaceCats URLs
   */
  getMultipleRandomPhotos(
    count: number = 5,
    minSize: number = 200,
    maxSize: number = 600
  ): string[] {
    const photos: string[] = [];

    for (let i = 0; i < count; i++) {
      const width = this.getRandomSize(minSize, maxSize);
      const height = this.getRandomSize(minSize, maxSize);
      const endpoint = this.getRandomEndpoint();

      photos.push(this.buildUrl(endpoint, width, height));
    }

    return photos;
  }

  /**
   * Get a random endpoint from the available options
   */
  private getRandomEndpoint(): PlaceCatsEndpoint {
    const randomIndex = Math.floor(
      Math.random() * this.endpoints.length
    );
    return this.endpoints[randomIndex];
  }

  /**
   * Get a random size within the specified range
   */
  private getRandomSize(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Build a PlaceCats URL with the given parameters
   */
  private buildUrl(
    endpoint: PlaceCatsEndpoint,
    width: number,
    height: number,
    options?: PlaceCatsOptions
  ): string {
    let url = `${this.BASE_URL}/${endpoint}/${width}/${height}`;

    if (options) {
      const params = new URLSearchParams();
      if (options.fit) params.append("fit", options.fit);
      if (options.position)
        params.append("position", options.position);

      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    return url;
  }
}
