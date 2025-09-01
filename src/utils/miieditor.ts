export interface Slider {
	name: string;
	min: number;
	max: number;
}

export interface Subtab {
	name: string;
	type?: 'color' | 'slider' | 'component';
	values?: number[][] | string[][] | boolean[][] | Slider[][];
}

export interface Tab {
	name: string; subTabs?: Subtab[];
}

export const miiEditorJSON: {
	tabs: Tab[];
} = {
	tabs: [
		{
			name: 'faceType',
			subTabs: [
				{ name: 'faceType', values: [[0, 1, 8, 2, 3, 9, 4, 5, 10, 6, 7, 11]] },
				{
					name: 'makeupType',
					values: [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]]
				},
				{
					name: 'wrinklesType',
					values: [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]]
				},
				{
					name: 'skinColor',
					type: 'color',
					values: [
						['#FFCE98', '#FFBA64', '#FF7C3E', '#FFB184', '#CA5326', '#752E17 ']
					]
				}
			]
		},
		{
			name: 'hairType',
			subTabs: [
				{
					name: 'hairType',
					values: [
						[33, 47, 40, 37, 32, 107, 48, 51, 55, 70, 44, 66],
						[52, 50, 38, 49, 43, 31, 56, 68, 62, 115, 76, 119],
						[64, 81, 116, 121, 22, 58, 60, 87, 125, 117, 73, 75],
						[42, 89, 57, 54, 80, 34, 23, 86, 88, 118, 39, 36],
						[45, 67, 59, 65, 41, 30, 12, 16, 10, 82, 128, 129],
						[14, 95, 105, 100, 6, 20, 93, 102, 27, 4, 17, 110],
						[123, 8, 106, 72, 3, 21, 0, 98, 63, 90, 11, 120],
						[5, 74, 108, 94, 124, 25, 99, 69, 35, 13, 122, 113],
						[53, 24, 85, 83, 71, 131, 96, 101, 29, 7, 15, 112],
						[79, 1, 109, 127, 91, 26, 61, 103, 2, 77, 18, 92],
						[84, 9, 19, 130, 97, 104, 46, 78, 28, 114, 126, 111]
					]
				},
				{
					name: 'hairColor',
					type: 'color',
					values: [
						[
							'#0A0A09',
							'#562D1B',
							'#772314',
							'#9C481E',
							'#988B8D',
							'#664C1A',
							'#AA6822',
							'#FEB454'
						]
					]
				}
			]
		},
		{
			name: 'eyebrowType',
			subTabs: [
				{
					name: 'eyebrowType',
					values: [
						[6, 0, 12, 1, 9, 19, 7, 21, 8, 17, 5, 4],
						[11, 10, 2, 3, 14, 20, 15, 13, 22, 18, 16, 23]
					]
				},
				{
					name: 'eyebrowPosition',
					type: 'slider',
					values: [[
						{ name: 'eyebrowYPosition', min: 3, max: 18 },
						{ name: 'eyebrowSpacing', min: 0, max: 12 },
						{ name: 'eyebrowRotation', min: 0, max: 11 },
						{ name: 'eyebrowScale', min: 0, max: 8 },
						{ name: 'eyebrowVerticalStretch', min: 0, max: 6 }
					]]
				},
				{
					name: 'eyebrowColor',
					type: 'color',
					values: [
						[
							'#0A0A09',
							'#562D1B',
							'#772314',
							'#9C481E',
							'#988B8D',
							'#664C1A',
							'#AA6822',
							'#FEB454'
						]
					]
				}
			]
		},
		{
			name: 'eyeType',
			subTabs: [
				{
					name: 'eyeType',
					values: [
						[2, 4, 0, 8, 39, 17, 1, 26, 16, 15, 27, 20],
						[33, 11, 19, 32, 9, 12, 23, 34, 21, 25, 40, 35],
						[5, 41, 13, 36, 37, 6, 24, 30, 31, 18, 28, 46],
						[7, 44, 38, 42, 45, 29, 3, 43, 22, 10, 14, 47],
						[48, 49, 50, 53, 59, 56, 54, 58, 57, 55, 51, 52]
					]
				},
				{
					name: 'eyePosition',
					type: 'slider',
					values: [[
						{ name: 'eyeYPosition', min: 0, max: 18 },
						{ name: 'eyeSpacing', min: 0, max: 12 },
						{ name: 'eyeRotation', min: 0, max: 7 },
						{ name: 'eyeScale', min: 0, max: 7 },
						{ name: 'eyeVerticalStretch', min: 0, max: 6 }
					]]
				},
				{
					name: 'eyeColor',
					type: 'color',
					values: [
						['#070606', '#887E75', '#814631', '#796A34', '#565BA4', '#4C8260']
					]
				}
			]
		},
		{
			name: 'noseType',
			subTabs: [
				{
					name: 'noseType',
					values: [
						[1, 10, 2, 3, 6, 0, 5, 4, 8, 9, 7, 11],
						[13, 14, 12, 17, 16, 15]
					]
				},
				{
					name: 'nosePosition',
					type: 'slider',
					values: [[
						{ name: 'noseYPosition', min: 0, max: 18 },
						{ name: 'noseScale', min: 0, max: 8 }
					]]
				}
			]
		},
		{
			name: 'mouthType',
			subTabs: [
				{
					name: 'mouthType',
					values: [
						[23, 1, 19, 21, 22, 5, 0, 8, 10, 16, 6, 13],
						[7, 9, 2, 17, 3, 4, 15, 11, 20, 18, 14, 12],
						[27, 30, 24, 25, 29, 28, 26, 35, 31, 34, 33, 32]
					]
				},
				{
					name: 'mouthPosition',
					type: 'slider',
					values: [[
						{ name: 'mouthYPosition', min: 0, max: 18 },
						{ name: 'mouthScale', min: 0, max: 8 },
						{ name: 'mouthHorizontalStretch', min: 0, max: 6 }
					]]
				},
				{
					name: 'mouthColor',
					type: 'color',
					values: [['#FF5D0C', '#FF110C', '#FF524B', '#FFAA77', '#181312']]
				}
			]
		},
		{
			name: 'glassesType',
			subTabs: [
				{
					name: 'glassesType',
					values: [[0, 1, 2, 3, 4, 5, 6, 7, 8]]
				},
				{
					name: 'glassesPosition',
					type: 'slider',
					values: [[
						{ name: 'glassesYPosition', min: 0, max: 20 },
						{ name: 'glassesScale', min: 0, max: 7 }
					]]
				},
				{
					name: 'glassesColor',
					type: 'color',
					values: [
						['#000000', '#7A4011', '#D51208', '#29376E', '#D56D00', '#987F6E']
					]
				}
			]
		},
		{
			name: 'beardType',
			subTabs: [
				{
					name: 'beardType',
					values: [[0, 1, 2, 3, 4, 5]]
				},
				{
					name: 'mustacheType',
					values: [[0, 1, 2, 3, 4, 5]]
				},
				{
					name: 'facialHairPosition',
					type: 'slider',
					values: [[
						{ name: 'mustacheYPosition', min: 0, max: 16 },
						{ name: 'mustacheScale', min: 0, max: 8 }
					]]
				},
				{
					name: 'facialHairColor',
					type: 'color',
					values: [
						[
							'#0A0A09',
							'#562D1B',
							'#772314',
							'#9C481E',
							'#988B8D',
							'#664C1A',
							'#AA6822',
							'#FEB454'
						]
					]
				}
			]
		},
		{
			name: 'moleEnabled',
			subTabs: [
				{
					name: 'moleEnabled',
					values: [[false, true]]
				},
				{
					name: 'molePosition',
					type: 'slider',
					values: [[
						{ name: 'moleYPosition', min: 0, max: 30 },
						{ name: 'moleXPosition', min: 0, max: 16 },
						{ name: 'moleScale', min: 0, max: 8 }
					]]
				}
			]
		},
		{
			name: 'miisc',
			subTabs: [
				{
					name: 'size',
					type: 'slider',
					values: [[
						{ name: 'height', min: 0, max: 127 },
						{ name: 'build', min: 0, max: 127 }
					]]
				},
				{
					name: 'gender',
					values: [[0, 1]]
				},
				{
					name: 'favoriteColor',
					type: 'color',
					values: [
						[
							'#FF2216',
							'#FF7A1A',
							'#FFED22',
							'#91F321',
							'#008332',
							'#0D50BE',
							'#49BBE4',
							'#FF6381',
							'#8B2DB2',
							'#573D18',
							'#FFFFFF',
							'#1D1A15'
						]
					]
				}

			]
		},
		{
			name: 'save', subTabs: [{ name: 'info', type: 'component' }, { name: 'save', type: 'component' }]
		}
	]
};
