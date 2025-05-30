'use server';
/**
 * @fileOverview This file defines a Genkit flow for smart cropping and scaling of images.
 *
 * The flow takes an image data URI as input and returns a data URI of the cropped and scaled image.
 * It uses GenAI to identify the main subject and crop accordingly.
 *
 * @interface SmartCropAndScaleInput - Defines the input schema for the smart crop and scale flow.
 * @interface SmartCropAndScaleOutput - Defines the output schema for the smart crop and scale flow.
 * @function smartCropAndScale - The exported function to call the smart crop and scale flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartCropAndScaleInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      'The image to crop and scale, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // per instructions, use data URI.
    ),
});
export type SmartCropAndScaleInput = z.infer<typeof SmartCropAndScaleInputSchema>;

const SmartCropAndScaleOutputSchema = z.object({
  croppedImageDataUri: z.string().describe('The cropped and scaled image as a data URI.'),
});
export type SmartCropAndScaleOutput = z.infer<typeof SmartCropAndScaleOutputSchema>;

export async function smartCropAndScale(input: SmartCropAndScaleInput): Promise<SmartCropAndScaleOutput> {
  return smartCropAndScaleFlow(input);
}

const smartCropAndScalePrompt = ai.definePrompt({
  name: 'smartCropAndScalePrompt',
  input: {schema: SmartCropAndScaleInputSchema},
  output: {schema: SmartCropAndScaleOutputSchema},
  prompt: [
    {media: {url: '{{{imageDataUri}}}'}},
    {
      text:
        'Analyze the image and smartly crop and scale it to a standardized aspect ratio (16:9) while ensuring the main subject remains in focus. Return the resulting image as a data URI.',
    },
  ],
  model: 'googleai/gemini-2.0-flash-exp',
  config: {
    responseModalities: ['TEXT', 'IMAGE'],
  },
});

const smartCropAndScaleFlow = ai.defineFlow(
  {
    name: 'smartCropAndScaleFlow',
    inputSchema: SmartCropAndScaleInputSchema,
    outputSchema: SmartCropAndScaleOutputSchema,
  },
  async input => {
    const {media} = await smartCropAndScalePrompt(input) as {media: {url: string}};
    return {croppedImageDataUri: media.url!};
  }
);
