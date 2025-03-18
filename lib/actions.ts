"use server";

import { cookies } from "next/headers";
import { createClient } from "@sanity/client";

// Initialize Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  useCdn: process.env.NODE_ENV === "production",
  apiVersion: "2023-05-03",
  token: process.env.SANITY_API_TOKEN, // Required for write operations
});

export async function login(email: string, password: string) {
  try {
    // Query Sanity for user with matching email
    const user = await client.fetch(`*[_type == "user" && email == $email][0]`, { email });

    if (!user) {
      return { success: false, error: "Invalid email or password" };
    }

    // In a real app, you would use a proper password hashing library
    // This is just for demonstration purposes
    if (user.password !== password) {
      return { success: false, error: "Invalid email or password" };
    }

    // Create session
    const session = {
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role || "user",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    };

    // Store session in a cookie
    (await cookies()).set({
      name: "session",
      value: JSON.stringify(session),
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "lax",
    });

    // Update last login time
    await client
      .patch(user._id)
      .set({
        lastLogin: new Date().toISOString(),
      })
      .commit();

    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "An error occurred during login" };
  }
}

export async function register(name: string, email: string, password: string) {
  try {
    // Check if user already exists
    const existingUser = await client.fetch(`*[_type == "user" && email == $email][0]`, { email });

    if (existingUser) {
      return { success: false, error: "Email already in use" };
    }

    // In a real app, you would hash the password here
    // For demonstration purposes, we're storing it as is
    // const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user in Sanity
    const newUser = await client.create({
      _type: "user",
      name,
      email,
      password, // In production, use hashedPassword
      role: "user",
      status: "active",
      createdAt: new Date().toISOString(),
    });

    return { success: true, userId: newUser._id };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: "An error occurred during registration" };
  }
}

export async function logout() {
  (await cookies()).delete("session");
  return { success: true };
}

export async function getSession() {
  const sessionCookie = (await cookies()).get("session");

  if (!sessionCookie) {
    return null;
  }

  try {
    return JSON.parse(sessionCookie.value);
  } catch {
    return null;
  }
}

// Group management functions
export async function fetchGroups() {
  try {
    const groups = await client.fetch(`
      *[_type == "group"] | order(name asc) {
        _id,
        name,
        description,
        createdAt,
        "memberCount": count(*[_type == "member" && references(^._id)])
      }
    `);
    return groups;
  } catch (error) {
    console.error("Error fetching groups:", error);
    throw new Error("Failed to fetch groups");
  }
}

export async function createGroup(data: { name: string; description: string }) {
  try {
    const newGroup = await client.create({
      _type: "group",
      name: data.name,
      description: data.description,
      createdAt: new Date().toISOString(),
    });
    return newGroup;
  } catch (error) {
    console.error("Error creating group:", error);
    throw new Error("Failed to create group");
  }
}

export async function updateGroup(id: string, data: { name: string; description: string }) {
  try {
    const updatedGroup = await client
      .patch(id)
      .set({
        name: data.name,
        description: data.description,
      })
      .commit();
    return updatedGroup;
  } catch (error) {
    console.error("Error updating group:", error);
    throw new Error("Failed to update group");
  }
}

export async function deleteGroup(id: string) {
  try {
    // First, update all members that belong to this group
    await client
      .patch({
        query: `*[_type == "member" && group._ref == $groupId]`,
        params: { groupId: id },
      })
      .unset(["group"])
      .commit();

    // Then delete the group
    await client.delete(id);
    return { success: true };
  } catch (error) {
    console.error("Error deleting group:", error);
    throw new Error("Failed to delete group");
  }
}

// Member management functions
export async function fetchMembers() {
  try {
    const members = await client.fetch(`
      *[_type == "member"] | order(name asc) {
        _id,
        name,
        email,
        phone,
        "groupId": group._ref,
        "groupName": group->name,
        role,
        joinedAt
      }
    `);
    return members;
  } catch (error) {
    console.error("Error fetching members:", error);
    throw new Error("Failed to fetch members");
  }
}

export async function createMember(data: {
  name: string;
  email: string;
  phone: string;
  groupId: string;
  role: string;
}) {
  try {
    const newMember = await client.create({
      _type: "member",
      name: data.name,
      email: data.email,
      phone: data.phone,
      group: {
        _type: "reference",
        _ref: data.groupId,
      },
      role: data.role,
      joinedAt: new Date().toISOString(),
    });
    return newMember;
  } catch (error) {
    console.error("Error creating member:", error);
    throw new Error("Failed to create member");
  }
}

export async function updateMember(
  id: string,
  data: {
    name: string;
    email: string;
    phone: string;
    groupId: string;
    role: string;
  }
) {
  try {
    const updatedMember = await client
      .patch(id)
      .set({
        name: data.name,
        email: data.email,
        phone: data.phone,
        group: {
          _type: "reference",
          _ref: data.groupId,
        },
        role: data.role,
      })
      .commit();
    return updatedMember;
  } catch (error) {
    console.error("Error updating member:", error);
    throw new Error("Failed to update member");
  }
}

export async function deleteMember(id: string) {
  try {
    await client.delete(id);
    return { success: true };
  } catch (error) {
    console.error("Error deleting member:", error);
    throw new Error("Failed to delete member");
  }
}

// Gathering management functions
export async function fetchGatherings() {
  try {
    const gatherings = await client.fetch(`
      *[_type == "gathering"] | order(date desc) {
        _id,
        title,
        description,
        date,
        location,
        isActive,
        createdAt
      }
    `);
    return gatherings;
  } catch (error) {
    console.error("Error fetching gatherings:", error);
    throw new Error("Failed to fetch gatherings");
  }
}

export async function fetchActiveGatherings() {
  try {
    const gatherings = await client.fetch(`
      *[_type == "gathering" && isActive == true] | order(date asc) {
        _id,
        title,
        date,
        location,
        description
      }
    `);
    return gatherings;
  } catch (error) {
    console.error("Error fetching active gatherings:", error);
    throw new Error("Failed to fetch active gatherings");
  }
}

export async function createGathering(data: {
  title: string;
  description: string;
  date: string;
  location: string;
  isActive: boolean;
}) {
  try {
    const newGathering = await client.create({
      _type: "gathering",
      title: data.title,
      description: data.description,
      date: new Date(data.date).toISOString(),
      location: data.location,
      isActive: data.isActive,
      createdAt: new Date().toISOString(),
    });
    return newGathering;
  } catch (error) {
    console.error("Error creating gathering:", error);
    throw new Error("Failed to create gathering");
  }
}

export async function updateGathering(
  id: string,
  data: {
    title: string;
    description: string;
    date: string;
    location: string;
    isActive: boolean;
  }
) {
  try {
    const updatedGathering = await client
      .patch(id)
      .set({
        title: data.title,
        description: data.description,
        date: new Date(data.date).toISOString(),
        location: data.location,
        isActive: data.isActive,
      })
      .commit();
    return updatedGathering;
  } catch (error) {
    console.error("Error updating gathering:", error);
    throw new Error("Failed to update gathering");
  }
}

export async function deleteGathering(id: string) {
  try {
    await client.delete(id);
    return { success: true };
  } catch (error) {
    console.error("Error deleting gathering:", error);
    throw new Error("Failed to delete gathering");
  }
}

// Registration management functions
export async function fetchRegistrations() {
  try {
    const registrations = await client.fetch(`
      *[_type == "registration"] | order(registeredAt desc) {
        _id,
        "gatheringId": gathering._ref,
        "gatheringTitle": gathering->title,
        "memberId": member._ref,
        "memberName": member->name,
        "groupId": member->group._ref,
        "groupName": member->group->name,
        status,
        registeredAt
      }
    `);
    return registrations;
  } catch (error) {
    console.error("Error fetching registrations:", error);
    throw new Error("Failed to fetch registrations");
  }
}

export async function createRegistration(data: { gatheringId: string; memberId: string; status: string }) {
  try {
    // Check if member is already registered for this gathering
    const existingRegistration = await client.fetch(
      `*[_type == "registration" && gathering._ref == $gatheringId && member._ref == $memberId][0]`,
      { gatheringId: data.gatheringId, memberId: data.memberId }
    );

    if (existingRegistration) {
      throw new Error("Member is already registered for this gathering");
    }

    const newRegistration = await client.create({
      _type: "registration",
      gathering: {
        _type: "reference",
        _ref: data.gatheringId,
      },
      member: {
        _type: "reference",
        _ref: data.memberId,
      },
      status: data.status,
      registeredAt: new Date().toISOString(),
    });
    return newRegistration;
  } catch (error) {
    console.error("Error creating registration:", error);
    throw error;
  }
}

export async function updateRegistration(
  id: string,
  data: {
    gatheringId?: string;
    memberId?: string;
    status: string;
  }
) {
  try {
    // Create patch
    const patch = client.patch(id).set({
      status: data.status,
    });

    // Only update gathering and member if provided (usually not changed)
    if (data.gatheringId) {
      patch.set({
        gathering: {
          _type: "reference",
          _ref: data.gatheringId,
        },
      });
    }

    if (data.memberId) {
      patch.set({
        member: {
          _type: "reference",
          _ref: data.memberId,
        },
      });
    }

    const updatedRegistration = await patch.commit();
    return updatedRegistration;
  } catch (error) {
    console.error("Error updating registration:", error);
    throw error;
  }
}

export async function deleteRegistration(id: string) {
  try {
    await client.delete(id);
    return { success: true };
  } catch (error) {
    console.error("Error deleting registration:", error);
    throw error;
  }
}

// User management functions
export async function fetchUsers() {
  try {
    const users = await client.fetch(`
      *[_type == "user"] | order(name asc) {
        _id,
        name,
        email,
        role,
        status,
        createdAt,
        lastLogin
      }
    `);
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
}

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  role: string;
  status: string;
}) {
  try {
    // Check if user already exists
    const existingUser = await client.fetch(`*[_type == "user" && email == $email][0]`, { email: data.email });

    if (existingUser) {
      throw new Error("Email already in use");
    }

    const newUser = await client.create({
      _type: "user",
      name: data.name,
      email: data.email,
      password: data.password, // In production, use hashedPassword
      role: data.role,
      status: data.status,
      createdAt: new Date().toISOString(),
    });
    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

export async function updateUser(
  id: string,
  data: {
    name: string;
    email: string;
    password?: string;
    role: string;
    status: string;
  }
) {
  try {
    // Check if email is already in use by another user
    const existingUser = await client.fetch(`*[_type == "user" && email == $email && _id != $id][0]`, {
      email: data.email,
      id,
    });

    if (existingUser) {
      throw new Error("Email already in use by another user");
    }

    // Create patch
    const patch = client.patch(id).set({
      name: data.name,
      email: data.email,
      role: data.role,
      status: data.status,
    });

    // Only update password if provided
    if (data.password && data.password.trim() !== "") {
      patch.set({ password: data.password });
    }

    const updatedUser = await patch.commit();
    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

export async function deleteUser(id: string) {
  try {
    // Check if user is an admin
    const user = await client.fetch(`*[_type == "user" && _id == $id][0]`, { id });

    if (user.role === "admin") {
      throw new Error("Cannot delete admin users");
    }

    await client.delete(id);
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}
