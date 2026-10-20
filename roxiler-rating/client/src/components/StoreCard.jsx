
function StoreCard({ store, onRate }) {
    return (
        <div className="store-card">
            <h3>{store.name}</h3>

            <p>Address: {store.address}</p>

            <p>
                Overall Rating:{" "}
                {Number(store.overall_rating).toFixed(1)}
                {" / 5"}
            </p>

            <p>
                Your Rating:{" "}
                {store.user_rating ?? "Not rated yet"}
            </p>

            <button onClick={() => onRate(store)}>
                {store.user_rating == null
                    ? "Submit Rating"
                    : "Modify Rating"}
            </button>
        </div>
    );
}

export default StoreCard;
