// ? Routes
// ? PETshop temperaly Database
const pets = [];
// ? /
export async function GET_(ctx) {
    for (const key in ctx) {
        console.log({ [key]: ctx[key] });
    }
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
export const GET_petBy$id = async function (ctx) {
    const petId = ctx.params?.id;
    const pet = pets.find((p) => p.id === petId);
    if (pet) {
        ctx.send(pet);
    }
    else {
        ctx.code = 404;
        ctx.send({ message: "Pet not found" });
    }
};
GET_petBy$id.config = {
    body: {
        name: { err: "please provide dog name", type: "string" },
        image: { type: "file", nullable: true, inputType: "file" },
        age: { type: "number", inputType: "number" },
        id: {},
    },
    info: "This api allows you to update a pet with it's ID",
};
// ? /pets
// Add a New Pet: Add a new pet to the inventory
export const POST_pets = async function (ctx) {
    const body = this.validate(await ctx.json());
    const newPet = body;
    newPet.id = String(Date.now());
    pets.push(newPet);
    ctx.send({ message: "Pet added successfully", pet: newPet });
};
POST_pets.config = {
    body: {
        name: { err: "please provide dog name", type: "string" },
        image: { type: "string", nullable: true, inputType: "file" },
        age: { type: "number", nullable: true, inputType: "number" },
        id: {},
    },
    headers: {
        "Content-Type": "application/json",
        Authorization: "Bear *********",
        "X-Pet-Token": "token",
    },
};
// ? /pets/q/?
// Add a New Pet: Add a new pet to the inventory
export async function GET_pets_search$$(ctx) {
    POST_pets.validate?.(ctx.search);
    ctx.send({
        message: "Pets searched successfully",
        pets: pets.filter((pet) => pet.name === ctx.search.name || pet.name.includes(ctx.search.name)),
    });
}
// Update a Pet: Modify the details of an existing pet
// ? /petBy/8766
export const PUT_petBy$id = async function (ctx) {
    const updatedPetData = PUT_petBy$id.validate?.(await ctx.json());
    const petId = ctx.params.id;
    console.log({ updatedPetData, petId });
    const index = pets.findIndex((p) => p.id === petId);
    if (index !== -1) {
        // Update the existing pet's data
        pets[index] = { ...pets[index], ...updatedPetData };
        ctx.send({ message: "Pet updated successfully", pet: pets[index] });
    }
    else {
        ctx.code = 404;
        ctx.send({ message: "Pet not found" });
    }
};
PUT_petBy$id.config = {
    body: {
        image: { type: "file", inputType: "file" },
        video: { type: "file", inputType: "file" },
        textfield: { type: "string", nullable: false },
    },
};
// ? /petBy/8766
// Delete a Pet: Remove a pet from the inventory
export function DELETE_petBy$id(ctx) {
    const petId = ctx.params.id;
    const index = pets.findIndex((p) => p.id === petId);
    if (index !== -1) {
        const deletedPet = pets.splice(index, 1)[0];
        ctx.send({ message: "Pet deleted successfully", pet: deletedPet });
    }
    else {
        ctx.code = 400;
        ctx.send({ message: "Pet not found" });
    }
}
// ? /petImage/76554
// Upload a Pet's Image: Add an image to a pet's profile
export const POST_petImage$id = async function (ctx) {
    const petId = ctx.params.id;
    const formdata = await ctx.request.formData();
    // console.log(formdata);
    const profilePicture = formdata.get("image");
    if (!profilePicture)
        throw new Error("Must upload a profile picture.");
    console.log({ formdata, profilePicture });
    const index = pets.findIndex((p) => p.id === petId);
    if (index !== -1) {
        // Attach the image URL to the pet's profile (in a real scenario, consider storing images externally)
        pets[index].image = `/images/${petId}.png`;
        // write profilePicture to disk
        // @ts-ignore
        await Bun.write(pets[index].imageUrl, profilePicture);
        ctx.send({
            message: "Image uploaded successfully",
            imageUrl: pets[index].image,
        });
    }
    else {
        ctx.code = 404;
        ctx.send({ message: "Pet not found" });
    }
};
POST_petImage$id.config = {
    body: {
        image: { type: "string", nullable: true, inputType: "file" },
        id: {},
        name: {},
        age: {},
    },
};
// ? error hook
export function hook__ERROR(ctx, err) {
    ctx.app.clean();
    ctx.throw(String(err));
}
export async function GET_error(ctx) {
    ctx.throw("Edwinger loves jetpath");
}
export const POST_ = async function (ctx) {
    const form = await ctx.app.formData(ctx);
    console.log(form);
    if (form.image) {
        await form.image.saveTo(form.image.filename);
    }
    ctx.send(form);
};
POST_.config = {
    body: {
        image: { type: "file", inputType: "file" },
        video: { type: "file", inputType: "file" },
        textfield: { type: "string", nullable: false },
    },
};
export function GET_user_profile(ctx) {
    ctx.send("hello world");
}
export function POST_user_profile$id$$(ctx) {
    ctx.send("hello world");
}
