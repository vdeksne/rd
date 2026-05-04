import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Separator } from "@/components/Ui/Separator";

const meta = {
  title: "UI/Separator",
  component: Separator,
  tags: ["autodocs"],
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-4">
      <p className="text-sm text-muted-foreground">Section A</p>
      <Separator />
      <p className="text-sm text-muted-foreground">Section B</p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-24 items-stretch gap-4">
      <span className="text-sm">Left</span>
      <Separator orientation="vertical" />
      <span className="text-sm">Right</span>
    </div>
  ),
};
