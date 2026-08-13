import api from "./api";

export async function getConversations() {
  const response = await api.get("/conversations");

  return response.data;
}

export async function createConversation(subject) {
  const response = await api.post("/conversations", {
    subject
  });

  return response.data;
}

export async function getMessages(id) {
  const response = await api.get(
    `/conversations/${id}/messages`
  );

  return response.data;
}

export async function closeConversation(id) {
  const response = await api.patch(
    `/conversations/${id}/close`
  );

  return response.data;
}