type jsonTP = {
  [key: string]: string;
};

interface fetchDataProps {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: jsonTP;
}

export async function fetchData(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  data?: jsonTP,
): Promise<string[]> {
  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: method !== 'GET' ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`오류가 발생했습니다! : ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}
