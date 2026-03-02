import Button from "../../../../../components/UI/Button";
import Header from "../../../../../components/UI/Header";
import Input from "../../../../../components/UI/Input";

function Profile() {
  return (
    <div className="flex-1">
      <div className="bg-panel border-accent/20 flex flex-col border-b p-8">
        <Header>Profile</Header>
        <form className="mt-4 space-y-6">
          <div className="bg-panel2 w-full rounded-2xl">
            <div className="flex items-center p-4">
              <p className="text-text mr-4">Image</p>
              <div>
                <h2 className="font-display text-text mb-2 text-xl font-extrabold">
                  John Doe
                </h2>
                <p className="text-muted font-body mb-2 text-sm">
                  @johndoe • ID: usr_7f2k9
                </p>

                <div className="flex items-center gap-x-4">
                  <input
                    type="file"
                    id="photo"
                    name="photo"
                    accept="image/*"
                    className="absolute -z-10 h-0 w-0 opacity-0"
                  />
                  <label
                    htmlFor="photo"
                    className="text-text cursor-pointer text-sm hover:underline"
                  >
                    Edit photo →
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div>
            <label
              className="font-display text-muted mb-2 block text-sm tracking-widest uppercase"
              htmlFor="name"
            >
              Display name
            </label>
            <Input
              type="text"
              name="name"
              id="name"
              placeholder="Edit your display name..."
            />
          </div>
          <div>
            <label
              className="font-display text-muted mb-2 block text-sm tracking-widest uppercase"
              htmlFor="username"
            >
              Username
            </label>
            <Input
              type="text"
              name="username"
              id="username"
              placeholder="Edit your username..."
            />
          </div>
          <div>
            <label
              className="font-display text-muted mb-2 block text-sm tracking-widest uppercase"
              htmlFor="bio"
            >
              Bio
            </label>
            <Input
              type="text"
              name="bio"
              id="bio"
              placeholder="Edit your bio..."
            />
          </div>
          <Button type="submit">Save Changes</Button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
