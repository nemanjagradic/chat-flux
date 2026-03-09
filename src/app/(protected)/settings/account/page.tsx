import { redirect } from "next/navigation";
import Button from "../../../../../components/UI/Button";
import Header from "../../../../../components/UI/Header";
import Input from "../../../../../components/UI/Input";
import { getCurrentUser } from "../../../../../lib/session";

export default async function Account() {
  const user = await getCurrentUser();
  if (!user) redirect("/account");

  return (
    <div className="flex-1">
      <div className="bg-panel border-accent/20 flex flex-col border-b p-8">
        <Header>Account</Header>
        <form className="mt-4 space-y-6">
          <div>
            <label
              className="font-display text-muted mb-2 block text-sm tracking-widest uppercase"
              htmlFor="email"
            >
              Email Address
            </label>
            <Input
              type="email"
              name="email"
              id="email"
              defaultValue="john@email.com"
            />
          </div>

          <div>
            <label
              className="font-display text-muted mb-2 block text-sm tracking-widest uppercase"
              htmlFor="newPassword"
            >
              New Password
            </label>
            <Input
              type="password"
              name="newPassword"
              id="newPassword"
              placeholder="Enter new password..."
            />
          </div>

          <div>
            <label
              className="font-display text-muted mb-2 block text-sm tracking-widest uppercase"
              htmlFor="confirmNewPassword"
            >
              Confirm Password
            </label>
            <Input
              type="password"
              name="confirmNewPassword"
              id="confirmNewPassword"
              placeholder="Confirm new password..."
            />
          </div>

          <div>
            <label className="font-display text-muted mb-2 block text-sm tracking-widest uppercase">
              User ID
            </label>
            <div className="border-panel2 bg-panel2 mt-2 flex items-center rounded-xl border px-4 py-2.5">
              <span className="font-body text-text flex-1 text-sm">
                usr_7f2k9x3m
              </span>
              <button
                type="button"
                className="font-display text-accent cursor-pointer text-xs font-bold"
              >
                Copy
              </button>
            </div>
          </div>
          <Button type="submit">Save Changes</Button>
        </form>
      </div>
    </div>
  );
}
