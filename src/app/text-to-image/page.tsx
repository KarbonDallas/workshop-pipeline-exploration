"use client";

import { useState, useTransition } from "react";
import * as Form from "@radix-ui/react-form";
import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { textToImage } from "~/app/actions";

const modelIds = [
  "ByteDance/SDXL-Lightning",
  "SG161222/RealVisXL_V4.0",
  "SG161222/RealVisXL_V4.0_Lightning",
  "black-forest-labs/FLUX.1-dev",
  "black-forest-labs/FLUX.1-schnell",
  "runwayml/stable-diffusion-v1-5",
  "stabilityai/stable-diffusion-3-medium-diffusers",
];
const heights = ["256", "512", "768", "1024"];
const widths = ["256", "512", "768", "1024"];

export default function TextToImagePage() {
  const [images, setImages] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] = useState({
    modelId: modelIds[0],
    height: heights[1],
    width: widths[1],
    safetyCheck: "true",
  });

  const handleSelectChange = (name: string, value: string) => {
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    // Add select values to formData
    Object.entries(formState).forEach(([key, value]) => {
      formData.set(key, value ?? "");
    });

    startTransition(async () => {
      const result = await textToImage(formData);
      if (result.success) {
        setImages((prevImages) => [...result.images, ...prevImages]);
      }
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold">
          Text-to-Image Generator
        </h1>
        <Form.Root onSubmit={onSubmit} className="space-y-4">
          <Form.Field name="prompt">
            <Form.Label className="block text-sm font-medium text-gray-700">
              Prompt
            </Form.Label>
            <Form.Control asChild>
              <textarea
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                required
              />
            </Form.Control>
          </Form.Field>

          <Form.Field name="modelId">
            <Form.Label className="block text-sm font-medium text-gray-700">
              Model ID
            </Form.Label>
            <Select.Root
              value={formState.modelId}
              onValueChange={(value) => handleSelectChange("modelId", value)}
            >
              <Select.Trigger className="mt-1 flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500">
                <Select.Value />
                <Select.Icon>
                  <ChevronDownIcon />
                </Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className="overflow-hidden rounded-md bg-white shadow-lg">
                  <Select.ScrollUpButton className="flex h-[25px] cursor-default items-center justify-center bg-white text-gray-700">
                    <ChevronUpIcon />
                  </Select.ScrollUpButton>
                  <Select.Viewport className="p-1">
                    {modelIds.map((id) => (
                      <Select.Item
                        key={id}
                        value={id}
                        className="relative flex cursor-default items-center rounded-md px-8 py-2 text-sm font-medium text-gray-700 focus:bg-blue-500 focus:text-white"
                      >
                        <Select.ItemText>{id}</Select.ItemText>
                        <Select.ItemIndicator className="absolute left-2 inline-flex items-center">
                          <ChevronDownIcon />
                        </Select.ItemIndicator>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                  <Select.ScrollDownButton className="flex h-[25px] cursor-default items-center justify-center bg-white text-gray-700">
                    <ChevronDownIcon />
                  </Select.ScrollDownButton>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </Form.Field>

          <div className="grid grid-cols-2 gap-4">
            <Form.Field name="height">
              <Form.Label className="block text-sm font-medium text-gray-700">
                Height
              </Form.Label>
              <Select.Root
                value={formState.height}
                onValueChange={(value) => handleSelectChange("height", value)}
              >
                <Select.Trigger className="mt-1 flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500">
                  <Select.Value />
                  <Select.Icon>
                    <ChevronDownIcon />
                  </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="overflow-hidden rounded-md bg-white shadow-lg">
                    <Select.Viewport className="p-1">
                      {heights.map((h) => (
                        <Select.Item
                          key={h}
                          value={h}
                          className="relative flex cursor-default items-center rounded-md px-8 py-2 text-sm font-medium text-gray-700 focus:bg-blue-500 focus:text-white"
                        >
                          <Select.ItemText>{h}</Select.ItemText>
                          <Select.ItemIndicator className="absolute left-2 inline-flex items-center">
                            <ChevronDownIcon />
                          </Select.ItemIndicator>
                        </Select.Item>
                      ))}
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </Form.Field>

            <Form.Field name="width">
              <Form.Label className="block text-sm font-medium text-gray-700">
                Width
              </Form.Label>
              <Select.Root
                value={formState.width}
                onValueChange={(value) => handleSelectChange("width", value)}
              >
                <Select.Trigger className="mt-1 flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500">
                  <Select.Value />
                  <Select.Icon>
                    <ChevronDownIcon />
                  </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="overflow-hidden rounded-md bg-white shadow-lg">
                    <Select.Viewport className="p-1">
                      {widths.map((w) => (
                        <Select.Item
                          key={w}
                          value={w}
                          className="relative flex cursor-default items-center rounded-md px-8 py-2 text-sm font-medium text-gray-700 focus:bg-blue-500 focus:text-white"
                        >
                          <Select.ItemText>{w}</Select.ItemText>
                          <Select.ItemIndicator className="absolute left-2 inline-flex items-center">
                            <ChevronDownIcon />
                          </Select.ItemIndicator>
                        </Select.Item>
                      ))}
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </Form.Field>
          </div>

          <Form.Field name="guidanceScale">
            <Form.Label className="block text-sm font-medium text-gray-700">
              Guidance Scale
            </Form.Label>
            <Form.Control asChild>
              <input
                type="number"
                min="1"
                max="20"
                defaultValue="7.5"
                step="0.1"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </Form.Control>
          </Form.Field>

          <Form.Field name="negativePrompt">
            <Form.Label className="block text-sm font-medium text-gray-700">
              Negative Prompt
            </Form.Label>
            <Form.Control asChild>
              <textarea className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
            </Form.Control>
          </Form.Field>

          <Form.Field name="safetyCheck">
            <Form.Label className="block text-sm font-medium text-gray-700">
              Safety Check
            </Form.Label>
            <Select.Root
              value={formState.safetyCheck}
              onValueChange={(value) =>
                handleSelectChange("safetyCheck", value)
              }
            >
              <Select.Trigger className="mt-1 flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500">
                <Select.Value />
                <Select.Icon>
                  <ChevronDownIcon />
                </Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className="overflow-hidden rounded-md bg-white shadow-lg">
                  <Select.Viewport className="p-1">
                    <Select.Item
                      value="true"
                      className="relative flex cursor-default items-center rounded-md px-8 py-2 text-sm font-medium text-gray-700 focus:bg-blue-500 focus:text-white"
                    >
                      <Select.ItemText>Enabled</Select.ItemText>
                      <Select.ItemIndicator className="absolute left-2 inline-flex items-center">
                        <ChevronDownIcon />
                      </Select.ItemIndicator>
                    </Select.Item>
                    <Select.Item
                      value="false"
                      className="relative flex cursor-default items-center rounded-md px-8 py-2 text-sm font-medium text-gray-700 focus:bg-blue-500 focus:text-white"
                    >
                      <Select.ItemText>Disabled</Select.ItemText>
                      <Select.ItemIndicator className="absolute left-2 inline-flex items-center">
                        <ChevronDownIcon />
                      </Select.ItemIndicator>
                    </Select.Item>
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </Form.Field>

          <Form.Field name="numInferenceSteps">
            <Form.Label className="block text-sm font-medium text-gray-700">
              Num Inference Steps
            </Form.Label>
            <Form.Control asChild>
              <input
                type="number"
                min="1"
                max="100"
                defaultValue="50"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </Form.Control>
          </Form.Field>

          <Form.Field name="numImagesPerPrompt">
            <Form.Label className="block text-sm font-medium text-gray-700">
              Num Images Per Prompt
            </Form.Label>
            <Form.Control asChild>
              <input
                type="number"
                min="1"
                max="4"
                defaultValue="1"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </Form.Control>
          </Form.Field>

          <Form.Field name="seed">
            <Form.Label className="block text-sm font-medium text-gray-700">
              Seed
            </Form.Label>
            <Form.Control asChild>
              <input
                type="number"
                defaultValue="0"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </Form.Control>
          </Form.Field>

          <Form.Submit asChild>
            <button
              className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={isPending}
            >
              {isPending ? "Generating..." : "Generate Images"}
            </button>
          </Form.Submit>
        </Form.Root>

        {images.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-4 text-xl font-semibold">Generated Images</h2>
            <div className="grid grid-cols-2 gap-4">
              {images.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`Generated Image ${index + 1}`}
                  className="h-auto w-full rounded-lg shadow-md"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
