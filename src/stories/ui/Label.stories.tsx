import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Input } from "@/components/Ui/Input";
import { Label } from "@/components/Ui/Label";

const meta = {
  title: "UI/Label",
  component: Label,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="flex w-[280px] max-w-full flex-col gap-2">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { children: "Label text" },
};

export const WithInput: Story = {
  render: () => (
    <>
      <Label htmlFor="story-email">Email</Label>
      <Input id="story-email" type="email" placeholder="you@example.com" />
    </>
  ),
};
