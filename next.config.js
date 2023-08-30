/** @type {import('next').NextConfig} */

const nextConfig = {
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'github.com',
				port: '',
				pathname: '/**'
			},
			{
				protocol: 'https',
				hostname: 'avatars.githubusercontent.com',
				port: '',
				pathname: '/u/**'
			},
			{
				protocol: 'https',
				hostname: 'github.githubassets.com',
				port: '',
				pathname: '/images/**'
			},
			{
				protocol: 'https',
				hostname: 'cdn.discordapp.com',
				port: '',
				pathname: '/avatars/**'
			}
		]
	}
};

export default nextConfig;
