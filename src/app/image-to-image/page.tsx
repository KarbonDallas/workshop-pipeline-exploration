"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import * as Form from "@radix-ui/react-form";
import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { imageToImage } from "~/app/actions";

const modelIds = ["timbrooks/instruct-pix2pix"];

export default function ImageToImagePage() {
  const [images, setImages] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] = useState({
    modelId: modelIds[0],
    safetyCheck: "true",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSelectChange = (name: string, value: string) => {
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    // Add select values to formData
    Object.entries(formState).forEach(([key, value]) => {
      formData.set(key, value ?? "");
    });

    // Add file to formData
    if (selectedFile) {
      formData.set("image", selectedFile);
    }

    startTransition(async () => {
      const result = await imageToImage(formData);
      if (result.success) {
        setImages((prevImages) => [...result.images, ...prevImages]);
      }
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold">
          Image-to-Image Generator
        </h1>
        <Form.Root onSubmit={onSubmit} className="space-y-4">
          <Form.Field name="image">
            <Form.Label className="block text-sm font-medium text-gray-700">
              Upload Image
            </Form.Label>
            <Form.Control asChild>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
              />
            </Form.Control>
          </Form.Field>

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

            <Form.Field name="imageGuidanceScale">
              <Form.Label className="block text-sm font-medium text-gray-700">
                Image Guidance Scale
              </Form.Label>
              <Form.Control asChild>
                <input
                  type="number"
                  min="0"
                  max="2"
                  defaultValue="1.5"
                  step="0.1"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </Form.Control>
            </Form.Field>
          </div>

          <Form.Field name="strength">
            <Form.Label className="block text-sm font-medium text-gray-700">
              Strength
            </Form.Label>
            <Form.Control asChild>
              <input
                type="number"
                min="0"
                max="1"
                defaultValue="0.8"
                step="0.01"
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
                <Image
                  key={index}
                  src={src}
                  alt={`Generated Image ${index + 1}`}
                  width={500}
                  height={500}
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
