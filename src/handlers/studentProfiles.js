/**
 * Lambda handlers for StudentProfiles:
 * - checkProfileExists: GET /api/users/me/profile-exists
 * - crud: GET /api/profiles (list all except me), GET/POST/PUT/DELETE /api/profiles and /api/profiles/me
 */

const { requireAuth } = require("../lib/jwt");
const studentProfilesService = require("../services/studentProfilesService");

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(body),
  };
}

function handleError(err) {
  const code = err.code ?? "INTERNAL_ERROR";
  const statusCode = err.statusCode ?? 500;
  const message = err.message ?? "Internal server error";
  return jsonResponse(statusCode, { error: code, message });
}

/**
 * GET /api/users/me/profile-exists
 * Returns { exists: true | false }
 */
async function checkProfileExists(event) {
  try {
    const { userId } = await requireAuth(event);
    const exists = await studentProfilesService.exists(userId);
    return jsonResponse(200, { exists });
  } catch (err) {
    return handleError(err);
  }
}

/**
 * CRUD router based on HTTP method and path
 */
async function crud(event) {
  try {
    const { userId } = await requireAuth(event);
    const method = event.httpMethod;
    const path = event.path ?? event.rawPath ?? "";
    const pathIncludesMe = /\/me(\/|$)/.test(path) || path.endsWith("/me");

    // GET /api/profiles (no /me) – List all profiles except current user (Students Connect)
    if (method === "GET" && path.includes("/profiles") && !pathIncludesMe) {
      const profiles = await studentProfilesService.listAllExceptUserId(userId);
      return jsonResponse(200, { profiles });
    }

    if (method === "GET" && pathIncludesMe) {
      const profile = await studentProfilesService.getByUserId(userId);
      if (!profile) {
        return jsonResponse(404, { error: "NOT_FOUND", message: "Profile not found" });
      }
      return jsonResponse(200, profile);
    }

    if (method === "POST" && path.includes("/profiles") && !pathIncludesMe) {
      const body = JSON.parse(event.body ?? "{}");
      const profile = await studentProfilesService.create(userId, body);
      return jsonResponse(201, profile);
    }

    if (method === "PUT" && pathIncludesMe) {
      const body = JSON.parse(event.body ?? "{}");
      const existing = await studentProfilesService.getByUserId(userId);
      if (!existing) {
        return jsonResponse(404, { error: "NOT_FOUND", message: "Profile not found" });
      }
      const profile = await studentProfilesService.update(userId, body);
      return jsonResponse(200, profile);
    }

    if (method === "DELETE" && pathIncludesMe) {
      await studentProfilesService.remove(userId);
      return jsonResponse(200, { deleted: true });
    }

    return jsonResponse(405, { error: "METHOD_NOT_ALLOWED", message: "Method not allowed" });
  } catch (err) {
    if (err instanceof SyntaxError && err.message.includes("JSON")) {
      return jsonResponse(400, { error: "BAD_REQUEST", message: "Invalid JSON body" });
    }
    return handleError(err);
  }
}

module.exports = {
  checkProfileExists,
  crud,
};
