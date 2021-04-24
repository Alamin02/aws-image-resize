function Status({ status }) {
  console.log(status);

  const columns = [
    { name: "Key", field: "imageKey" },
    { name: "Original Image", field: "mainUrl" },
    { name: "Status", field: "status" },
    { name: "Size", field: "size" },
    { name: "Processed Image", field: "processedUrl" },
  ];

  return (
    <table>
      <tr>
        {columns.map((col) => (
          <th key={col.field}>{col.name}</th>
        ))}
      </tr>
      {status.map((row) => (
        <tr key={row.imageKey}>
          {columns.map((col) => (
            <td>{row[col.field] || "None"}</td>
          ))}
        </tr>
      ))}
    </table>
  );
}

export default Status;
