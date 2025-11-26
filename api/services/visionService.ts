import vision from '@google-cloud/vision';

interface DetectedFood {
    name: string;
    confidence: number;
}

/**
 * Google Cloud Vision API Integration for Food Detection
 * Requires: GOOGLE_APPLICATION_CREDENTIALS environment variable
 */
export class VisionFoodDetector {
    private client: any = null;
    private isEnabled: boolean = false;

    constructor() {
        try {
            // Check if Google Cloud credentials are configured
            if (process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.USE_AI_DETECTION === 'true') {
                this.client = new vision.ImageAnnotatorClient();
                this.isEnabled = true;
                console.log('✅ Google Cloud Vision API initialized');
            } else {
                console.log('ℹ️  Google Cloud Vision API not configured - using demo mode');
            }
        } catch (error) {
            console.warn('⚠️  Failed to initialize Google Cloud Vision:', error);
            this.isEnabled = false;
        }
    }

    /**
     * Detect food items in an image using Google Cloud Vision API
     */
    async detectFood(imageBuffer: Buffer): Promise<DetectedFood[]> {
        if (!this.isEnabled || !this.client) {
            throw new Error('Google Cloud Vision API not enabled');
        }

        try {
            // Perform label detection
            const [result] = await this.client.labelDetection({
                image: { content: imageBuffer.toString('base64') }
            });

            const labels = result.labelAnnotations || [];

            // Filter for food-related labels
            const foodKeywords = [
                'food', 'fruit', 'vegetable', 'meat', 'dish', 'cuisine',
                'ingredient', 'produce', 'dairy', 'grain', 'protein',
                'apple', 'banana', 'orange', 'grape', 'chicken', 'fish',
                'pasta', 'rice', 'bread', 'egg', 'salad', 'soup', 'pizza',
                'burger', 'sandwich', 'noodle', 'beef', 'pork', 'cheese',
                'yogurt', 'milk', 'carrot', 'broccoli', 'tomato', 'potato'
            ];

            const detectedFoods: DetectedFood[] = labels
                .filter((label: any) => {
                    const description = label.description?.toLowerCase() || '';
                    return foodKeywords.some(keyword =>
                        description.includes(keyword) || keyword.includes(description)
                    );
                })
                .map((label: any) => ({
                    name: label.description || 'unknown',
                    confidence: label.score || 0
                }))
                .slice(0, 5); // Limit to top 5 detections

            return detectedFoods;
        } catch (error) {
            console.error('Vision API detection error:', error);
            throw error;
        }
    }

    /**
     * Perform object localization to detect specific food items
     */
    async detectFoodObjects(imageBuffer: Buffer): Promise<DetectedFood[]> {
        if (!this.isEnabled || !this.client) {
            throw new Error('Google Cloud Vision API not enabled');
        }

        try {
            // Perform object localization
            const [result] = await this.client.objectLocalization({
                image: { content: imageBuffer.toString('base64') }
            });

            const objects = result.localizedObjectAnnotations || [];

            const detectedFoods: DetectedFood[] = objects
                .filter((obj: any) => obj.name?.toLowerCase().includes('food'))
                .map((obj: any) => ({
                    name: obj.name || 'unknown',
                    confidence: obj.score || 0
                }))
                .slice(0, 5);

            return detectedFoods;
        } catch (error) {
            console.error('Vision API object detection error:', error);
            return [];
        }
    }

    /**
     * Check if Vision API is enabled and ready
     */
    isReady(): boolean {
        return this.isEnabled && this.client !== null;
    }
}

// Export singleton instance
export const visionDetector = new VisionFoodDetector();
