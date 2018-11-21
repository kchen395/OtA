import React from "react";

const Gallery = ({data}) => {
	return (
		<table>
		<thead>
			<tr>
				<th>Title</th>
				<th>Image</th>
				<th>Description</th>
				<th>Upvotes</th>
				<th>Address</th>
			</tr>
		</thead>
		<tbody>
			{data
				.filter(item => item.name)
				.map((item, i) => {
					return (
						<tr key={i}>
							<td>{item.name}</td>
							<td>
								<a href={item.link}>
									<img
										src={item.thumbnail}
										alt={"Image " + i}
										width="200px"
									/>
								</a>
							</td>
							<td>{item.description}</td>
							<td>
								<button
									className="btn"
									onClick={() => this.handleLike(item.id)}
								>
									<i className="fa fa-caret-up" />
								</button>
								<div>{item.upvotes}</div>
							</td>
							<td>
								<p>{item.address}</p>
							</td>
						</tr>
					);
				})}
		</tbody>
	</table>
	)
}

export default Gallery;