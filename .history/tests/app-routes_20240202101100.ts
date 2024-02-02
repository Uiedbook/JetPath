import { AppCTX, Schema } from "../dist/index.js";

//? Body validators

export const BODY_pets: Schema = {
  name: { err: "please provide dog name", type: "string" },
  image: { type: "string", nullable: true, inputType: "file" },
  age: { type: "number" },
};
export const BODY_petBy$id: Schema = {
  name: { err: "please provide dog name", type: "string" },
  image: { type: "string", nullable: true, inputType: "file" },
  age: { type: "number" },
  BODY_info: "This api allows you to access a pet with it's ID",
};
export const BODY_petImage$id: Schema = {
  image: { type: "string", inputType: "file" },
};

// ? Routes

// ? PETshop temperaly Database
const pets: { id: string; imageUrl: string; name: string }[] = [];

// ? /
export async function GET_(ctx: AppCTX) {
  ctx.reply("Welcome to Petshop!");
}

// List Pets: Retrieve a list of pets available in the shop
// ? /pets
export function GET_pets(ctx: AppCTX) {
  ctx.reply(pets);
}

// ? /petBy/19388
// Get a Pet by ID: Retrieve detailed information about a specific pet by its unique identifier
export function GET_petBy$id(ctx: AppCTX) {
  const petId = ctx.params?.id;
  const pet = pets.find((p) => p.id === petId);
  if (pet) {
    ctx.reply(pet);
  } else {
    ctx.code = 404;
    ctx.reply({ message: "Pet not found" });
  }
}

// ? /pets
// Add a New Pet: Add a new pet to the inventory
export async function POST_pets(ctx: AppCTX) {
  ctx.validate(await ctx.json());
  const newPet: { id: string; imageUrl: string; name: string } = ctx.body;
  // Generate a unique ID for the new pet (in a real scenario, consider using a UUID or another robust method)
  newPet.id = String(Date.now());
  pets.push(newPet);
  ctx.reply({ message: "Pet added successfully", pet: newPet });
}

// Update a Pet: Modify the details of an existing pet
// ? /petBy/8766
export async function PUT_petBy$id(ctx: AppCTX) {
  ctx.validate(await ctx.json());
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

// ? /petBy/8766
// Delete a Pet: Remove a pet from the inventory
export function DELETE_petBy$id(ctx: AppCTX) {
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

// ? /petImage/76554
// Upload a Pet's Image: Add an image to a pet's profile
export async function POST_petImage$id(ctx: AppCTX) {
  const petId = ctx.params.id;
  // @ts-ignore
  console.log(ctx.request);
  const formdata = await ctx.request.formData();
  console.log(formdata);
  const profilePicture = formdata.get("image");
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

// ? error hook
export function hook__ERROR(ctx: AppCTX, err: unknown) {
  ctx.code = 400;
  console.log(err);
  ctx.reply(String(err));
}
