//? Body validators
export const BODY_pets = {
  body: {
    name: { err: "please provide dog name", type: "string" },
    image: { type: "string", nullable: true, inputType: "file" },
    age: { type: "number", nullable: true, inputType: "number" },
  },
  info: "the pet api",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bear *********",
    "X-Pet-Token": "token",
  },
  method: "POST",
};
export const BODY_petBy$id = {
  body: {
    name: { err: "please provide dog name", type: "string" },
    image: { type: "string", nullable: true, inputType: "file" },
    age: { type: "number" },
  },
  info: "This api allows you to update a pet with it's ID",
  method: "PUT",
};
export const BODY_petImage$id = {
  body: { image: { type: "string", nullable: true, inputType: "file" } },
  method: "POST",
};
// ? Routes
// ? PETshop temperaly Database
const pets = [];
// ? /
export async function GET_(ctx) {
  new Promise(() => {
    setTimeout(() => {
      ctx.send("Welcome to Petshop!");
    }, 3000);
  });
  ctx.eject();
}
// List Pets: Retrieve a list of pets available in the shop
// ? /pets
export function GET_pets(ctx) {
  ctx.send(pets);
}
// ? /petBy/19388
// Get a Pet by ID: Retrieve detailed information about a specific pet by its unique identifier
export function GET_petBy$id(ctx) {
  const petId = ctx.params?.id;
  const pet = pets.find((p) => p.id === petId);
  if (pet) {
    ctx.send(pet);
  } else {
    ctx.code = 404;
    ctx.send({ message: "Pet not found" });
  }
}
// ? /pets
// Add a New Pet: Add a new pet to the inventory
export async function POST_pets(ctx) {
  const body = await ctx.json();
  ctx.validate?.(body);
  const newPet = body;
  // Generate a unique ID for the new pet (in a real scenario, consider using a UUID or another robust method)
  newPet.id = String(Date.now());
  pets.push(newPet);
  ctx.send({ message: "Pet added successfully", pet: newPet });
}
// ? /pets/q/?
// Add a New Pet: Add a new pet to the inventory
export async function GET_pets_search$$(ctx) {
  BODY_pets.validate?.(ctx.search);
  ctx.send({
    message: "Pets searched successfully",
    pets: pets.filter(
      (pet) =>
        pet.name === ctx.search.name || pet.name.includes(ctx.search.name)
    ),
  });
}
// Update a Pet: Modify the details of an existing pet
// ? /petBy/8766
export async function PUT_petBy$id(ctx) {
  BODY_petBy$id.validate?.(await ctx.json());
  const petId = ctx.params.id;
  const updatedPetData = await ctx.json();
  const index = pets.findIndex((p) => p.id === petId);
  if (index !== -1) {
    // Update the existing pet's data
    pets[index] = { ...pets[index], ...updatedPetData };
    ctx.send({ message: "Pet updated successfully", pet: pets[index] });
  } else {
    ctx.code = 404;
    ctx.send({ message: "Pet not found" });
  }
}
// ? /petBy/8766
// Delete a Pet: Remove a pet from the inventory
export function DELETE_petBy$id(ctx) {
  const petId = ctx.params.id;
  const index = pets.findIndex((p) => p.id === petId);
  if (index !== -1) {
    const deletedPet = pets.splice(index, 1)[0];
    ctx.send({ message: "Pet deleted successfully", pet: deletedPet });
  } else {
    ctx.code = 400;
    ctx.send({ message: "Pet not found" });
  }
}
// ? /petImage/76554
// Upload a Pet's Image: Add an image to a pet's profile
export async function POST_petImage$id(ctx) {
  const petId = ctx.params.id;
  // @ts-ignore
  // console.log({ r: ctx.request });
  const formdata = await ctx.request.formData();
  // console.log(formdata);
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
    ctx.send({
      message: "Image uploaded successfully",
      imageUrl: pets[index].imageUrl,
    });
  } else {
    ctx.code = 404;
    ctx.send({ message: "Pet not found" });
  }
}
// ? error hook
export function hook__ERROR(ctx, err) {
  ctx.code = 400;
  // console.log(err);
  ctx.send(String(err));
}
export async function GET_error(ctx) {
  ctx.throw("Edwinger loves jetpath");
}
