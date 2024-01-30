import { AppCTXType, JetPathSchema } from "../dist/index.js";

export async function GET_(ctx: AppCTXType) {
  ctx.reply("hello world!");
}
export const BODY_pets: JetPathSchema = {
  name: { err: "please provide dog name", type: "string" },
  imageUrl: { type: "string" },
  age: { type: "number" },
};

const pets: { id: string; imageUrl: string; name: string }[] = [];

// List Pets: Retrieve a list of pets available in the shop
export function GET_pets(ctx: AppCTXType) {
  console.log("boohoo");
  ctx.reply(pets);
}

// Get a Pet by ID: Retrieve detailed information about a specific pet by its unique identifier
export function GET_petBy$id(ctx: AppCTXType) {
  const petId = ctx.params?.id;
  const pet = pets.find((p) => p.id === petId);
  if (pet) {
    ctx.reply(pet);
  } else {
    ctx.code = 404;
    ctx.reply({ message: "Pet not found" });
  }
}

// Add a New Pet: Add a new pet to the inventory
export async function POST_pets(ctx: AppCTXType) {
  ctx.validate(await ctx.json());
  const newPet: { id: string; imageUrl: string; name: string } = ctx.body;
  // Generate a unique ID for the new pet (in a real scenario, consider using a UUID or another robust method)
  newPet.id = String(Date.now());
  pets.push(newPet);
  ctx.reply({ message: "Pet added successfully", pet: newPet });
}

// Update a Pet: Modify the details of an existing pet
export async function PUT_petBy$id(ctx: AppCTXType) {
  const petId = ctx.params.id;
  const updatedPetData = await ctx.json();
  const index = pets.findIndex((p) => p.id === petId);
  if (index !== -1) {
    // Update the existing pet's data
    pets[index] = { ...pets[index], ...updatedPetData };
    ctx.reply({ message: "Pet updated successfully", pet: pets[index] });
  } else {
    ctx.code = 404;
    ctx.reply({ message: "Pet not found" });
  }
}

// Delete a Pet: Remove a pet from the inventory
export function DELETE_petBy$id(ctx: AppCTXType) {
  const petId = ctx.params.id;
  const index = pets.findIndex((p) => p.id === petId);
  if (index !== -1) {
    const deletedPet = pets.splice(index, 1)[0];
    ctx.reply({ message: "Pet deleted successfully", pet: deletedPet });
  } else {
    ctx.code = 404;
    ctx.reply({ message: "Pet not found" });
  }
}

// Upload a Pet's Image: Add an image to a pet's profile
export async function POST_petImage$id(ctx: AppCTXType) {
  const petId = ctx.params.id;

  // @ts-ignore
  const formdata = await ctx.request.formData();
  const profilePicture = formdata.get("profilePicture");
  if (!profilePicture) throw new Error("Must upload a profile picture.");
  console.log({ formdata, profilePicture });

  const index = pets.findIndex((p) => p.id === petId);
  if (index !== -1) {
    // Attach the image URL to the pet's profile (in a real scenario, consider storing images externally)
    pets[index].imageUrl = `/images/${petId}.png`;
    // write profilePicture to disk
    // @ts-ignore
    await Bun.write(pets[index].imageUrl, profilePicture);
    ctx.reply({
      message: "Image uploaded successfully",
      imageUrl: pets[index].imageUrl,
    });
  } else {
    ctx.code = 404;
    ctx.reply({ message: "Pet not found" });
  }
}

export function hook__ERROR(ctx: AppCTXType, err: unknown) {
  ctx.code = 400;
  console.log(err);
  ctx.reply(String(err));
}
