current implementation of moon service comes from the suncalc library at https://github.com/mourner/suncalc


there can be undefined rise or set times for a particular day because it crosses date boundaries

example data for this is the following results at

		const huttoLat = 30.545806;
		const huttoLong = -97.542111;



{when: 2025-08-31, rise: 14:54:11, set: 00:06:12}
{when: 2025-09-01, rise: 15:49:08, set: 00:52:24}
{when: 2025-09-02, rise: 16:40:00, set: 01:44:25}
{when: 2025-09-03, rise: 17:25:25, set: 02:42:34}
{when: 2025-09-04, rise: 18:05:41, set: 03:44:14}
{when: 2025-09-05, rise: 18:42:48, set: 04:48:06}
{when: 2025-09-06, rise: 19:15:25, set: 05:52:04}
{when: 2025-09-07, rise: 19:47:19, set: 06:56:12}
{when: 2025-09-08, rise: 20:18:14, set: 08:00:28}
{when: 2025-09-09, rise: 20:50:30, set: 09:05:21}
{when: 2025-09-10, rise: 21:25:27, set: 10:12:13}
{when: 2025-09-11, rise: 22:04:47, set: 11:21:58}
{when: 2025-09-12, rise: 22:51:32, set: 12:34:19}
{when: 2025-09-13, rise: 23:46:07, set: 13:46:24}
{when: 2025-09-14, rise: undefined, set: 14:55:07}
{when: 2025-09-15, rise: 00:47:52, set: 15:56:02}
{when: 2025-09-16, rise: 01:54:36, set: 16:47:46}
{when: 2025-09-17, rise: 03:02:42, set: 17:30:19}
{when: 2025-09-18, rise: 04:09:49, set: 18:06:52}
{when: 2025-09-19, rise: 05:13:10, set: 18:38:08}
{when: 2025-09-20, rise: 06:13:22, set: 19:06:04}
{when: 2025-09-21, rise: 07:10:21, set: 19:31:49}
{when: 2025-09-22, rise: 08:05:55, set: 19:58:25}
{when: 2025-09-23, rise: 09:00:39, set: 20:24:21}
{when: 2025-09-24, rise: 09:56:09, set: 20:53:53}
{when: 2025-09-25, rise: 10:52:25, set: 21:25:28}
{when: 2025-09-26, rise: 11:49:26, set: 22:03:32}
{when: 2025-09-27, rise: 12:46:15, set: 22:46:48}
{when: 2025-09-28, rise: 13:41:33, set: 23:36:11}
{when: 2025-09-29, rise: 14:33:31, set: undefined}
{when: 2025-09-30, rise: 15:20:22, set: 00:32:06}
{when: 2025-10-01, rise: 16:02:09, set: 01:32:10}


so, for purposes of display, what we'll do is sort the data and just return a pair of rise/set times, even if they cross dates