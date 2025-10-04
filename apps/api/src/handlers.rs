use axum::{
    extract::{Path, State, Query},
    Json,
    http::StatusCode,
    response::IntoResponse,
};
use crate::{
    db::{create_evidence_job, get_evidence_by_id, list_evidence_jobs},
    models::{EvidenceIn, Pagination},
    AppState,
};

pub async fn health() -> &'static str { "OK" }

pub async fn list_evidence(State(state): State<AppState>, Query(pagination): Query<Pagination>) -> impl IntoResponse {
    let page = pagination.page.unwrap_or(1);
    let per_page = pagination.per_page.unwrap_or(10);
    let offset = (page - 1) * per_page;

    match list_evidence_jobs(&state.pool, per_page, offset).await {
        Ok((jobs, total_count)) => {
            let response = serde_json::json!({
                "data": jobs,
                "page": page,
                "per_page": per_page,
                "total": total_count,
            });
            (StatusCode::OK, Json(response)).into_response()
        },
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({ "error": e.to_string() }))).into_response(),
    }
}

pub async fn post_evidence(State(state): State<AppState>, Json(body): Json<EvidenceIn>) -> impl IntoResponse {
    match create_evidence_job(&state.pool, &body).await {
        Ok((id, rows_affected)) => {
            if rows_affected > 0 {
                (StatusCode::OK, Json(serde_json::json!({ "id": id, "status": "queued" }))).into_response()
            } else {
                (StatusCode::CONFLICT, Json(serde_json::json!({ "error": "evidence with this ID already exists", "id": id }))).into_response()
            }
        },
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({ "error": e.to_string() }))).into_response(),
    }
}

pub async fn get_evidence(State(state): State<AppState>, Path(id): Path<String>) -> impl IntoResponse {
    match get_evidence_by_id(&state.pool, &id).await {
        Ok(Some(evidence)) => {
            match serde_json::to_value(evidence) {
                Ok(json) => (StatusCode::OK, Json(json)).into_response(),
                Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({ "error": e.to_string() }))).into_response(),
            }
        },
        Ok(None) => (StatusCode::NOT_FOUND, Json(serde_json::json!({ "id": id, "status": "not_found" }))).into_response(),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({ "error": e.to_string() }))).into_response(),
    }
}